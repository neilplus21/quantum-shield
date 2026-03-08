import { motion } from "framer-motion";
import NavHeader from "@/components/dashboard/NavHeader";
import { BookOpen, HelpCircle, Target, Award, AlertTriangle } from "lucide-react";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.5 } });

const Section = ({ title, icon: Icon, children, delay = 0 }: { title: string; icon: React.ElementType; children: React.ReactNode; delay?: number }) => (
  <motion.section {...fade(delay)} className="bg-card border border-border rounded-lg p-6 md:p-8 space-y-4">
    <div className="flex items-center gap-3 mb-2">
      <Icon className="w-5 h-5 text-foreground" />
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
    </div>
    {children}
  </motion.section>
);

const researchQuestions = [
  "How can a Blockchain–IoT framework improve scalability and security in resource-constrained IoT networks?",
  "Which clustering techniques provide the best balance of energy efficiency and fairness?",
  "Can a multi-criteria cluster head selection method improve network lifetime?",
  "How effective is the Extended DPoL consensus mechanism compared to traditional blockchain consensus algorithms?",
  "How does post-quantum encryption improve IoT security?",
];

const objectives = [
  "Design an integrated Blockchain–IoT architecture.",
  "Compare clustering algorithms (LEACH, CHEF, HEED, DEEC, K-Means, Custom MCDM/WSM) in IoT simulations.",
  "Develop a multi-criteria cluster head election algorithm.",
  "Implement Extended Delegated Proof-of-Luck consensus.",
  "Integrate Kyber-512 and AES-GCM encryption for quantum-resistant security.",
  "Evaluate trade-offs between network lifetime, fairness, and energy consumption.",
];

const contributions = [
  "A hybrid Blockchain–IoT framework combining clustering, consensus, and post-quantum encryption.",
  "A multi-criteria cluster head selection mechanism using the Weighted Sum Method (WSM).",
  "An Extended Delegated Proof-of-Luck consensus protocol optimized for IoT.",
  "Integration of Kyber-512 lattice-based cryptography with AES-GCM encryption.",
  "Comparative evaluation of clustering algorithms under different energy scenarios.",
];

const ResearchOverview = () => (
  <div className="min-h-screen bg-background">
    <NavHeader />
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      {/* Title */}
      <motion.div {...fade(0)} className="text-center space-y-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Research Paper</p>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight max-w-3xl mx-auto">
          Blockchain-IoT Integration with Extended Proof-of-Luck Consensus and Energy-Aware Clustering for Post-Quantum Security
        </h1>
        <p className="text-sm text-muted-foreground">Research Project &middot; 2024–2025</p>
      </motion.div>

      {/* Abstract */}
      <Section title="Abstract" icon={BookOpen} delay={0.1}>
        <p className="text-sm text-muted-foreground leading-relaxed">
          This research proposes a Blockchain–IoT framework that integrates <span className="text-foreground font-medium">energy-aware clustering</span>, <span className="text-foreground font-medium">Extended Delegated Proof-of-Luck (DPoL) consensus</span>, and <span className="text-foreground font-medium">post-quantum cryptography</span> to address critical challenges in IoT security and scalability.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The system improves scalability, fairness, energy efficiency, and quantum security. The framework compares clustering algorithms including LEACH, CHEF, HEED, DEEC, K-Means, and a Custom MCDM/WSM approach. Results demonstrate improved network lifetime and fairness, while the Extended DPoL consensus achieves faster blockchain logging for IoT data.
        </p>
      </Section>

      {/* Introduction */}
      <Section title="Introduction" icon={BookOpen} delay={0.15}>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>Blockchain provides secure and tamper-proof logging for IoT networks. However, IoT devices are energy-constrained, making clustering essential for efficient data management and communication.</p>
          <p>Traditional consensus mechanisms like Proof-of-Work are computationally expensive and impractical for IoT environments. Furthermore, future quantum computers threaten traditional cryptographic schemes such as RSA and ECC.</p>
          <p>The proposed framework integrates <span className="text-foreground font-medium">energy-aware clustering</span>, <span className="text-foreground font-medium">Extended Delegated Proof-of-Luck consensus</span>, and <span className="text-foreground font-medium">post-quantum hybrid cryptography</span> to build a secure, scalable, and energy-efficient Blockchain–IoT system.</p>
        </div>
      </Section>

      {/* Research Questions */}
      <Section title="Research Questions" icon={HelpCircle} delay={0.2}>
        <ol className="space-y-3">
          {researchQuestions.map((q, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="text-foreground font-mono text-xs mt-0.5 shrink-0">RQ{i + 1}</span>
              <span className="text-muted-foreground leading-relaxed">{q}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* Research Gaps */}
      <Section title="Research Gaps" icon={AlertTriangle} delay={0.25}>
        <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc pl-5">
          <li>Limited integration of clustering, consensus, and post-quantum encryption in a single IoT–Blockchain framework.</li>
          <li>Existing clustering algorithms do not adequately balance energy efficiency and fairness in heterogeneous IoT networks.</li>
          <li>Current IoT blockchain systems rely on consensus mechanisms not optimized for resource-constrained environments.</li>
          <li>Insufficient adoption of quantum-resistant cryptographic primitives in IoT security architectures.</li>
        </ul>
      </Section>

      {/* Objectives */}
      <Section title="Objectives" icon={Target} delay={0.3}>
        <ol className="space-y-2">
          {objectives.map((obj, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="bg-secondary text-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">{i + 1}</span>
              <span className="text-muted-foreground leading-relaxed">{obj}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* Contributions */}
      <Section title="Key Contributions" icon={Award} delay={0.35}>
        <ul className="space-y-2">
          {contributions.map((c, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="text-foreground mt-1 shrink-0">▸</span>
              <span className="text-muted-foreground leading-relaxed">{c}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  </div>
);

export default ResearchOverview;
