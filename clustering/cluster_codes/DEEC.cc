#include "ns3/core-module.h"
#include "ns3/network-module.h"
#include "ns3/internet-module.h"
#include "ns3/mobility-module.h"
#include "ns3/energy-module.h"
#include "ns3/netanim-module.h"
#include <vector>
#include <fstream>
#include <sstream>
#include <iostream>
#include <iomanip>
#include <set>
#include <cmath>
#include <string>

using namespace ns3;

// --- CONFIGURATION ---
const uint32_t NUM_NODES = 20;
const uint32_t NUM_ROUNDS = 70;// dies at 52nd round
const double CH_PROB = 0.1;
const double RADIUS = 60.0;
const double INIT_ENERGY = 2.0;
const uint32_t PKT_SIZE = 4000;
const double Popt = 0.1;
const int EPOCH = int(1.0 / Popt);

// CSV Node setup
struct NodeInit { double x, y, energy; };

// Node Info for simulation
struct NodeInfo {
    Ptr<Node> node;
    Vector position;
    double energy;
    bool isCH;
    int parentCH;
    bool isDead;
    uint32_t clusterId;
    int roundsSinceLastCH;
    bool eligibleForCH;
    NodeInfo() : node(0), position(), energy(0), isCH(false), parentCH(-1), isDead(false), clusterId(0)/*, roundsSinceLastCH(0), eligibleForCH(true)*/ {}
};

std::vector<NodeInit> ReadNodeSetup(const std::string& filename) {
    std::vector<NodeInit> nodeInit;
    std::ifstream infile(filename);
    std::string line;
    std::getline(infile, line);
    while (std::getline(infile, line)) {
        std::stringstream ss(line);
        std::string token;
        NodeInit n;
        std::getline(ss, token, ','); n.x = std::stod(token);
        std::getline(ss, token, ','); n.y = std::stod(token);
        std::getline(ss, token, ','); n.energy = std::stod(token);
        nodeInit.push_back(n);
    }
    return nodeInit;
}

double Distance(const Vector& a, const Vector& b) {
    return std::sqrt(std::pow(a.x - b.x, 2) + std::pow(a.y - b.y, 2));
}

// --- The "main event" function: one call per round ---
void DoDeecRound(uint32_t r,
                 std::vector<NodeInfo>* pNodeInfos,
                 AnimationInterface* anim,
                 std::ofstream* plogfile,
                 Ptr<UniformRandomVariable> random) {
    std::vector<NodeInfo>& nodeInfos = *pNodeInfos;
    std::ofstream& logfile = *plogfile;

    // Reset CHs
    std::set<int> chSet;
    for (uint32_t i = 0; i < NUM_NODES; ++i) {
        nodeInfos[i].isCH = false;
        nodeInfos[i].parentCH = -1;
        nodeInfos[i].clusterId = 0;
    }

    // Dead node check
    for (uint32_t i = 0; i < NUM_NODES; ++i) {
        if (nodeInfos[i].energy <= 0.0) {
            nodeInfos[i].isDead = true;
            nodeInfos[i].energy = 0.0;
            anim->UpdateNodeColor(i, 128, 128, 128);
            anim->UpdateNodeDescription(i, "DEAD");
            anim->UpdateNodeSize(i, 7, 7);
        }
    }

    //Update Eligibility Per Round
    for (uint32_t i = 0; i < NUM_NODES; ++i) {
        if (nodeInfos[i].isDead) continue;
        if (nodeInfos[i].roundsSinceLastCH >= EPOCH)
            nodeInfos[i].eligibleForCH = true;
    }

    // --- DEEC CH election
    double totalEnergy = 0.0;
    int aliveNodes = 0;
    for (uint32_t i = 0; i < NUM_NODES; ++i) {
        if (!nodeInfos[i].isDead) {
            totalEnergy += nodeInfos[i].energy;
            aliveNodes++;
        }
    }
    double avgEnergy = (aliveNodes > 0) ? (totalEnergy / aliveNodes) : 1e-9;  // Prevent div by zero

    double Popt = 0.1; // Desired CH percentage

    for (uint32_t i = 0; i < NUM_NODES; ++i) {
        if (nodeInfos[i].isDead || !nodeInfos[i].eligibleForCH) continue;

        double Pi = Popt * (nodeInfos[i].energy / avgEnergy);
        if (Pi > 1.0) Pi = 1.0;

        double T = Pi / (1 - Pi * (r % EPOCH));
        double randVal = random->GetValue();

        if (randVal < T) {
            nodeInfos[i].isCH = true;
            nodeInfos[i].eligibleForCH = false;
            nodeInfos[i].roundsSinceLastCH = 0;
            chSet.insert(i);
        }
    }

    //Update Round Counters
    for (uint32_t i = 0; i < NUM_NODES; ++i) {
        if (!nodeInfos[i].isDead && !nodeInfos[i].isCH)
            nodeInfos[i].roundsSinceLastCH++;
    }

    // If no CHs, force the alive node with max energy to be CH
    if (chSet.empty()) {
        double maxE = -1e9; int best = -1;
        for (uint32_t i = 0; i < NUM_NODES; ++i) {
            if (!nodeInfos[i].isDead && nodeInfos[i].energy > maxE) {
                maxE = nodeInfos[i].energy;
                best = i;
            }
        }
        if (best != -1) {
            nodeInfos[best].isCH = true;
            chSet.insert(best);
        }
    }

    // Cluster formation (join closest CH within RADIUS)
    for (uint32_t i = 0; i < NUM_NODES; ++i) {
        if (nodeInfos[i].isDead || nodeInfos[i].isCH) continue;
        double minDist = 1e9; int bestCH = -1;
        for (auto ch : chSet) {
            double d = Distance(nodeInfos[i].position, nodeInfos[ch].position);
            if (d < minDist && d < RADIUS) {
                minDist = d;
                bestCH = ch;
            }
        }
        if (bestCH != -1) {
            nodeInfos[i].parentCH = bestCH;
            nodeInfos[i].clusterId = bestCH;
        }
    }
    // Orphan assignment (as in your other codes)
    for (uint32_t i = 0; i < NUM_NODES; ++i) {
        if (nodeInfos[i].isDead || nodeInfos[i].isCH) continue;
        if (nodeInfos[i].parentCH == -1) {
            double minDist = 1e9; int bestCH = -1;
            for (auto ch : chSet) {
                double d = Distance(nodeInfos[i].position, nodeInfos[ch].position);
                if (d < minDist) {
                    minDist = d;
                    bestCH = ch;
                }
            }
            if (bestCH != -1) {
                nodeInfos[i].parentCH = bestCH;
                nodeInfos[i].clusterId = bestCH;
            }
        }
    }

    // --- Visualization: Update color & label with CH ID or MemberOf --- //
    for (uint32_t i = 0; i < NUM_NODES; ++i) {
        if (nodeInfos[i].isDead) {
            anim->UpdateNodeColor(i, 128, 128, 128);
            anim->UpdateNodeDescription(i, "DEAD");
            anim->UpdateNodeSize(i, 7, 7);
        } else if (nodeInfos[i].isCH) {
            anim->UpdateNodeColor(i, 0, 200, 255); // Light blue for DEEC CHs
            anim->UpdateNodeDescription(i, "CH " + std::to_string(i));
            anim->UpdateNodeSize(i, 15, 15);
        } else {
            anim->UpdateNodeColor(i, 0, 0, 255);
            anim->UpdateNodeDescription(i, "M->" + std::to_string(nodeInfos[i].parentCH));
            anim->UpdateNodeSize(i, 7, 7);
        }
    }

    // Energy drain (same as your other protocols)
    double E_ELEC = 50e-9;
    double E_AMP = 100e-12;
    double PKT_SIZE_BITS = 4000 * 8;

    for (uint32_t i = 0; i < NUM_NODES; ++i) {
        if (!nodeInfos[i].isDead && !nodeInfos[i].isCH && nodeInfos[i].parentCH != -1) {
            double d = Distance(nodeInfos[i].position, nodeInfos[nodeInfos[i].parentCH].position);
            nodeInfos[i].energy -= (E_ELEC * PKT_SIZE_BITS + E_AMP * PKT_SIZE_BITS * d * d);
            nodeInfos[nodeInfos[i].parentCH].energy -= E_ELEC * PKT_SIZE_BITS;
        }
    }
    // CHs: data aggregation and long-range transmission to BS
    Vector baseStationPos(250, 250, 0);
    for (auto ch : chSet) {
        int members = 0;
        for (uint32_t i = 0; i < NUM_NODES; ++i)
            if (!nodeInfos[i].isDead && nodeInfos[i].parentCH == (int)ch) members++;
        double aggCost = E_ELEC * PKT_SIZE_BITS * members;
        double dToBS = Distance(nodeInfos[ch].position, baseStationPos);
        double txToBsCost = (E_ELEC * PKT_SIZE_BITS + E_AMP * PKT_SIZE_BITS * dToBS * dToBS);
        nodeInfos[ch].energy -= aggCost;
        nodeInfos[ch].energy -= txToBsCost;
    }

    // --- Metrics/logging
    double totalE = 0, minEnergy = 1e9, maxEnergy = -1e9;
    int numDead = 0;
    std::vector<int> clusterSizes(chSet.size(), 0);
    int chIdx = 0;
    std::map<int, int> chToIdx;
    for (auto ch : chSet) chToIdx[ch] = chIdx++;
    for (uint32_t i = 0; i < NUM_NODES; ++i) {
        totalE += nodeInfos[i].energy;
        if (nodeInfos[i].energy < minEnergy) minEnergy = nodeInfos[i].energy;
        if (nodeInfos[i].energy > maxEnergy) maxEnergy = nodeInfos[i].energy;
        if (nodeInfos[i].isDead || nodeInfos[i].energy <= 0.0) numDead++;
        if (!nodeInfos[i].isDead && nodeInfos[i].parentCH != -1)
            clusterSizes[chToIdx[nodeInfos[i].parentCH]]++;
    }
    double fairness = 0.0;
    if (!clusterSizes.empty()) {
        double meanCH = double(NUM_NODES - numDead) / clusterSizes.size();
        for (int size : clusterSizes) fairness += std::pow(size - meanCH, 2);
        fairness = std::sqrt(fairness / clusterSizes.size());
    }

    std::cout << "Round " << r
              << " Dead: " << numDead
              << " AvgE: " << totalE/NUM_NODES
              << " MinE: " << minEnergy
              << " MaxE: " << maxEnergy
              << " #CH: " << chSet.size()
              << " Fairness: " << fairness
              << std::endl;
    logfile << r << "," << numDead << "," << totalE/NUM_NODES << "," << minEnergy << "," << maxEnergy << "," << chSet.size() << "," << fairness << "\n";
}



int main(int argc, char *argv[]) {
    NodeContainer nodes;
    nodes.Create(NUM_NODES);

    std::vector<NodeInit> nodesetup = ReadNodeSetup("scratch/nodesetup.csv");
    if (nodesetup.size() != NUM_NODES) {
        std::cerr << "Error: node setup size (" << nodesetup.size()
                  << ") does not match NUM_NODES (" << NUM_NODES << ")." << std::endl;
        return 1;
    }

    BasicEnergySourceHelper energySourceHelper;
    ns3::energy::EnergySourceContainer sources;
    Ptr<ListPositionAllocator> posAlloc = CreateObject<ListPositionAllocator>();
    for (uint32_t i = 0; i < NUM_NODES; ++i) {
        posAlloc->Add(Vector(nodesetup[i].x, nodesetup[i].y, 0));
        NodeContainer singleNode;
        singleNode.Add(nodes.Get(i));
        energySourceHelper.Set("BasicEnergySourceInitialEnergyJ", DoubleValue(nodesetup[i].energy));
        auto nodeSource = energySourceHelper.Install(singleNode);
        sources.Add(nodeSource.Get(0));
    }

    MobilityHelper mobility;
    mobility.SetPositionAllocator(posAlloc);
    mobility.SetMobilityModel("ns3::ConstantPositionMobilityModel");
    mobility.Install(nodes);

    InternetStackHelper stack;
    stack.Install(nodes);

    AnimationInterface anim("deec-iot-anim.xml");
    std::vector<NodeInfo> nodeInfos(NUM_NODES);
    for (uint32_t i = 0; i < NUM_NODES; ++i) {
        nodeInfos[i].node = nodes.Get(i);
        nodeInfos[i].position = Vector(nodesetup[i].x, nodesetup[i].y, 0);
        nodeInfos[i].energy = nodesetup[i].energy;
        nodeInfos[i].isCH = false;
        nodeInfos[i].parentCH = -1;
        nodeInfos[i].isDead = false;
        nodeInfos[i].clusterId = 0;
        nodeInfos[i].roundsSinceLastCH = 0;
        nodeInfos[i].eligibleForCH = true;
        anim.SetConstantPosition(nodes.Get(i), nodesetup[i].x, nodesetup[i].y);
        anim.UpdateNodeColor(i, 0, 255, 0);
        anim.UpdateNodeDescription(i, "Node " + std::to_string(i));
    }

    Ptr<UniformRandomVariable> random = CreateObject<UniformRandomVariable>();
    std::ofstream logfile("deec_log.csv");
    logfile << "Round,Dead,AvgEnergy,MinEnergy,MaxEnergy,CHs,Fairness\n";

    // Schedule each round's event so NetAnim can animate it!
    for (uint32_t r = 0; r < NUM_ROUNDS; ++r) {
        Simulator::Schedule(Seconds(r * 1.0), DoDeecRound, r, &nodeInfos, &anim, &logfile, random);
    }

    Simulator::Stop(Seconds(NUM_ROUNDS * 1.0 + 1.0));
    Simulator::Run();
    Simulator::Destroy();

    logfile.close();
    std::cout << "Simulation finished.\n";
    return 0;
}
