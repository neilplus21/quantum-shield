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
#include <limits>
#include <cstdlib>
#include <ctime>

using namespace ns3;

// --- CONFIGURATION ---
const uint32_t NUM_NODES = 20;
const uint32_t NUM_ROUNDS = 70;
const double CH_PROB = 0.1;
const double RADIUS = 60.0;
const double INIT_ENERGY = 2.0;
const uint32_t PKT_SIZE = 4000;

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
    NodeInfo() : node(0), position(), energy(0), isCH(false), parentCH(-1), isDead(false), clusterId(0) {}
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

// Helper: Euclidean distance between two points
double Dist(const Vector& a, const Vector& b) {
    return std::sqrt((a.x - b.x)*(a.x - b.x) + (a.y - b.y)*(a.y - b.y));
}

// K-means clustering: assigns each alive node to one of K clusters based on position
// Returns: vector<int> clusterId for each node, vector<Vector> centroids
void KMeansClustering(const std::vector<NodeInfo>& nodeInfos, int K,
                      std::vector<int>& clusterIds, std::vector<Vector>& centroids) {
    std::vector<Vector> aliveNodes;
    std::vector<int> aliveIdx;
    for (size_t i = 0; i < nodeInfos.size(); ++i) {
        if (!nodeInfos[i].isDead) {
            aliveNodes.push_back(nodeInfos[i].position);
            aliveIdx.push_back(i);
        }
    }
    int n = aliveNodes.size();
    clusterIds.assign(nodeInfos.size(), -1);
    centroids.clear();
    if (n == 0) return;
    // Init centroids: pick K alive nodes at random
    std::vector<int> chosen;
    srand(time(NULL));
    while ((int)centroids.size() < K && (int)centroids.size() < n) {
        int idx = rand() % n;
        if (std::find(chosen.begin(), chosen.end(), idx) == chosen.end()) {
            centroids.push_back(aliveNodes[idx]);
            chosen.push_back(idx);
        }
    }
    // K-means loop: update assignments, update centroids, repeat (say 10 times)
    for (int iter = 0; iter < 10; ++iter) {
        // Assignment
        for (int j = 0; j < n; ++j) {
            double bestDist = std::numeric_limits<double>::max();
            int bestC = 0;
            for (int c = 0; c < (int)centroids.size(); ++c) {
                double d = Dist(aliveNodes[j], centroids[c]);
                if (d < bestDist) { bestDist = d; bestC = c; }
            }
            clusterIds[aliveIdx[j]] = bestC;
        }
        // Update centroids
        std::vector<Vector> newCentroids(centroids.size(), Vector(0,0,0));
        std::vector<int> counts(centroids.size(), 0);
        for (int j = 0; j < n; ++j) {
            int c = clusterIds[aliveIdx[j]];
            newCentroids[c].x += aliveNodes[j].x;
            newCentroids[c].y += aliveNodes[j].y;
            counts[c]++;
        }
        for (size_t c = 0; c < centroids.size(); ++c) {
            if (counts[c] > 0) {
                newCentroids[c].x /= counts[c];
                newCentroids[c].y /= counts[c];
            }
        }
        centroids = newCentroids;
    }
}

// Select cluster head using both proximity to centroid and highest energy
std::set<int> SelectCHsFromClusters(const std::vector<NodeInfo>& nodeInfos, 
                                   const std::vector<int>& clusterIds,
                                   const std::vector<Vector>& centroids) {
    std::set<int> chSet;
    for (size_t c = 0; c < centroids.size(); ++c) {
        double bestEnergy = -1.0;
        int bestIdx = -1;
        for (size_t i = 0; i < nodeInfos.size(); ++i) {
            if (nodeInfos[i].isDead || clusterIds[i] != (int)c) continue;
            double distToCentroid = Dist(nodeInfos[i].position, centroids[c]);
            if (distToCentroid <= RADIUS && nodeInfos[i].energy > bestEnergy) {
                bestEnergy = nodeInfos[i].energy;
                bestIdx = i;
            }
        }
        // fallback if no node within radius: pick any closest
        if (bestIdx == -1) {
            double minDist = 1e9;
            for (size_t i = 0; i < nodeInfos.size(); ++i) {
                if (nodeInfos[i].isDead || clusterIds[i] != (int)c) continue;
                double d = Dist(nodeInfos[i].position, centroids[c]);
                if (d < minDist) {
                    minDist = d;
                    bestIdx = i;
                }
            }
        }
        if (bestIdx != -1) chSet.insert(bestIdx);
    }
    return chSet;
}


// --- The "main event" function: one call per round ---
void DoKMeansRound(uint32_t r,
                   std::vector<NodeInfo>* pNodeInfos,
                   AnimationInterface* anim,
                   std::ofstream* plogfile) {
    std::vector<NodeInfo>& nodeInfos = *pNodeInfos;
    std::ofstream& logfile = *plogfile;

    // Reset states
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

    // K = Popt*N_alive
    double Popt = 0.2;
    int alive = 0;
    for (auto& n : nodeInfos) if (!n.isDead) alive++;
    int K = std::max(1, int(round(Popt * alive)));

    // K-means clustering
    std::vector<int> clusterIds;
    std::vector<Vector> centroids;
    KMeansClustering(nodeInfos, K, clusterIds, centroids);

    // Cluster head selection
    std::set<int> chSet = SelectCHsFromClusters(nodeInfos, clusterIds, centroids);

    // Assign members to CHs (by cluster ID)
    for (uint32_t i = 0; i < NUM_NODES; ++i) {
        nodeInfos[i].isCH = (chSet.count(i) != 0);
        nodeInfos[i].clusterId = clusterIds[i];
        if (!nodeInfos[i].isDead && !nodeInfos[i].isCH && clusterIds[i] != -1) {
            // Assign parentCH as the cluster's CH
            double bestDist = 1e9; int bestCH = -1;
            for (auto ch : chSet) {
                if (clusterIds[ch] == clusterIds[i]) {
                    double d = Dist(nodeInfos[i].position, nodeInfos[ch].position);
                    if (d < bestDist) { bestDist = d; bestCH = ch; }
                }
            }
            nodeInfos[i].parentCH = bestCH;
        }
    }

    // Visualization (same as before)
    for (uint32_t i = 0; i < NUM_NODES; ++i) {
        if (nodeInfos[i].isDead) {
            anim->UpdateNodeColor(i, 128, 128, 128);
            anim->UpdateNodeDescription(i, "DEAD");
            anim->UpdateNodeSize(i, 7, 7);
        } else if (nodeInfos[i].isCH) {
            anim->UpdateNodeColor(i, 255, 128, 0); // Orange for K-means CH
            anim->UpdateNodeDescription(i, "CH " + std::to_string(i));
            anim->UpdateNodeSize(i, 15, 15);
        } else {
            anim->UpdateNodeColor(i, 0, 0, 255);
            anim->UpdateNodeDescription(i, "M->" + std::to_string(nodeInfos[i].parentCH));
            anim->UpdateNodeSize(i, 7, 7);
        }
    }

    // Energy drain: same as LEACH (members -> CH, CH aggregates, CH -> BS)
    double E_ELEC = 50e-9;
    double E_AMP = 100e-12;
    double PKT_SIZE_BITS = 4000 * 8;
    Vector baseStationPos(250, 250, 0);

    for (uint32_t i = 0; i < NUM_NODES; ++i) {
        if (!nodeInfos[i].isDead && !nodeInfos[i].isCH && nodeInfos[i].parentCH != -1) {
            double d = Dist(nodeInfos[i].position, nodeInfos[nodeInfos[i].parentCH].position);
            nodeInfos[i].energy -= (E_ELEC * PKT_SIZE_BITS + E_AMP * PKT_SIZE_BITS * d * d);
            nodeInfos[nodeInfos[i].parentCH].energy -= E_ELEC * PKT_SIZE_BITS;
        }
    }
    for (auto ch : chSet) {
        int members = 0;
        for (uint32_t i = 0; i < NUM_NODES; ++i)
            if (!nodeInfos[i].isDead && nodeInfos[i].parentCH == (int)ch) members++;
        double aggCost = E_ELEC * PKT_SIZE_BITS * members;
        double dToBS = Dist(nodeInfos[ch].position, baseStationPos);
        double txToBsCost = (E_ELEC * PKT_SIZE_BITS + E_AMP * PKT_SIZE_BITS * dToBS * dToBS);
        nodeInfos[ch].energy -= aggCost;
        nodeInfos[ch].energy -= txToBsCost;
    }

    // Metrics/logging (as usual)
    double totalE = 0, minE = 1e9, maxE = -1e9;
    int numDead = 0;
    std::vector<int> clusterSizes(K, 0);
    for (uint32_t i = 0; i < NUM_NODES; ++i) {
        totalE += nodeInfos[i].energy;
        if (nodeInfos[i].energy < minE) minE = nodeInfos[i].energy;
        if (nodeInfos[i].energy > maxE) maxE = nodeInfos[i].energy;
        if (nodeInfos[i].isDead || nodeInfos[i].energy <= 0.0) numDead++;
        if (!nodeInfos[i].isDead && clusterIds[i] != -1)
            clusterSizes[clusterIds[i]]++;
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
              << " MinE: " << minE
              << " MaxE: " << maxE
              << " #CH: " << chSet.size()
              << " Fairness: " << fairness
              << std::endl;
    logfile << r << "," << numDead << "," << totalE/NUM_NODES << "," << minE << "," << maxE << "," << chSet.size() << "," << fairness << "\n";
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

    AnimationInterface anim("kmeans-iot-anim.xml");
    std::vector<NodeInfo> nodeInfos(NUM_NODES);
    for (uint32_t i = 0; i < NUM_NODES; ++i) {
        nodeInfos[i].node = nodes.Get(i);
        nodeInfos[i].position = Vector(nodesetup[i].x, nodesetup[i].y, 0);
        nodeInfos[i].energy = nodesetup[i].energy;
        nodeInfos[i].isCH = false;
        nodeInfos[i].parentCH = -1;
        nodeInfos[i].isDead = false;
        nodeInfos[i].clusterId = 0;
        anim.SetConstantPosition(nodes.Get(i), nodesetup[i].x, nodesetup[i].y);
        anim.UpdateNodeColor(i, 0, 255, 0);
        anim.UpdateNodeDescription(i, "Node " + std::to_string(i));
    }

    std::ofstream logfile("kmeans_log.csv");
    logfile << "Round,Dead,AvgEnergy,MinEnergy,MaxEnergy,CHs,Fairness\n";

    // Schedule each round's event so NetAnim can animate it!
    for (uint32_t r = 0; r < NUM_ROUNDS; ++r) {
        Simulator::Schedule(Seconds(r * 1.0), DoKMeansRound, r, &nodeInfos, &anim, &logfile);
    }

    Simulator::Stop(Seconds(NUM_ROUNDS * 1.0 + 1.0));
    Simulator::Run();
    Simulator::Destroy();

    logfile.close();
    std::cout << "Simulation finished.\n";
    return 0;
}
