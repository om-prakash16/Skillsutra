"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

// ── Types ──
interface SkillNode {
  id: string;
  skill_id: string;
  skill_name: string;
  skill_category: string;
  proficiency_level: string;
  proficiency_score: number;
  proof_score: number;
  is_primary: boolean;
  is_verified: boolean;
  endorsement_count: number;
  source: string;
  projects: { title: string; github_url?: string }[];
}

interface GraphNode extends SkillNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface GraphEdge {
  source: string;
  target: string;
  weight: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  language: "#6366f1",
  framework: "#06b6d4",
  tool: "#f59e0b",
  database: "#10b981",
  cloud: "#8b5cf6",
  concept: "#ec4899",
  ai_ml: "#14b8a6",
  soft_skill: "#f97316",
};

const PROFICIENCY_SCALE: Record<string, number> = {
  beginner: 0.5,
  intermediate: 0.75,
  advanced: 1.0,
  expert: 1.25,
};

// ── Component ──
export default function SkillGraphVisualization({
  nodes,
  onNodeClick,
}: {
  nodes: SkillNode[];
  onNodeClick?: (node: SkillNode) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const graphNodesRef = useRef<GraphNode[]>([]);
  const edgesRef = useRef<GraphEdge[]>([]);
  const animRef = useRef<number>(0);

  // Build graph data
  useEffect(() => {
    if (!nodes.length) return;

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    const gNodes: GraphNode[] = nodes.map((n, i) => {
      const angle = (i / nodes.length) * Math.PI * 2;
      const radius = 120 + Math.random() * 80;
      return {
        ...n,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius: 18 * (PROFICIENCY_SCALE[n.proficiency_level] || 0.75),
      };
    });

    // Build edges between same-category skills
    const edges: GraphEdge[] = [];
    for (let i = 0; i < gNodes.length; i++) {
      for (let j = i + 1; j < gNodes.length; j++) {
        if (gNodes[i].skill_category === gNodes[j].skill_category) {
          edges.push({
            source: gNodes[i].id,
            target: gNodes[j].id,
            weight: 0.6,
          });
        }
      }
    }

    graphNodesRef.current = gNodes;
    edgesRef.current = edges;
  }, [nodes, dimensions]);

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width: Math.max(400, width), height: Math.max(300, height) });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Force simulation + render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    let running = true;

    const simulate = () => {
      if (!running) return;
      const gNodes = graphNodesRef.current;
      const edges = edgesRef.current;

      // Simple force simulation
      for (let i = 0; i < gNodes.length; i++) {
        for (let j = i + 1; j < gNodes.length; j++) {
          const dx = gNodes[j].x - gNodes[i].x;
          const dy = gNodes[j].y - gNodes[i].y;
          const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
          const repulsion = 800 / (dist * dist);
          gNodes[i].vx -= (dx / dist) * repulsion;
          gNodes[i].vy -= (dy / dist) * repulsion;
          gNodes[j].vx += (dx / dist) * repulsion;
          gNodes[j].vy += (dy / dist) * repulsion;
        }
      }

      // Edge attraction
      for (const edge of edges) {
        const src = gNodes.find((n) => n.id === edge.source);
        const tgt = gNodes.find((n) => n.id === edge.target);
        if (!src || !tgt) continue;
        const dx = tgt.x - src.x;
        const dy = tgt.y - src.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const attraction = (dist - 100) * 0.005 * edge.weight;
        src.vx += (dx / dist) * attraction;
        src.vy += (dy / dist) * attraction;
        tgt.vx -= (dx / dist) * attraction;
        tgt.vy -= (dy / dist) * attraction;
      }

      // Center gravity + damping
      const cx = dimensions.width / 2;
      const cy = dimensions.height / 2;
      for (const n of gNodes) {
        n.vx += (cx - n.x) * 0.001;
        n.vy += (cy - n.y) * 0.001;
        n.vx *= 0.9;
        n.vy *= 0.9;
        n.x += n.vx;
        n.y += n.vy;
        n.x = Math.max(n.radius, Math.min(dimensions.width - n.radius, n.x));
        n.y = Math.max(n.radius, Math.min(dimensions.height - n.radius, n.y));
      }

      // Render
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Draw edges
      for (const edge of edges) {
        const src = gNodes.find((n) => n.id === edge.source);
        const tgt = gNodes.find((n) => n.id === edge.target);
        if (!src || !tgt) continue;
        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.strokeStyle = "rgba(148, 163, 184, 0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw nodes
      for (const n of gNodes) {
        const color = CATEGORY_COLORS[n.skill_category] || "#6366f1";
        const isHovered = hoveredNode?.id === n.id;

        // Glow for verified/primary
        if (n.is_verified || n.is_primary || isHovered) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 6, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(n.x, n.y, n.radius, n.x, n.y, n.radius + 6);
          gradient.addColorStop(0, color + "60");
          gradient.addColorStop(1, "transparent");
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? color : color + "cc";
        ctx.fill();
        ctx.strokeStyle = n.is_verified ? "#22c55e" : "rgba(255,255,255,0.2)";
        ctx.lineWidth = n.is_verified ? 2.5 : 1;
        ctx.stroke();

        // Proof score ring
        if (n.proof_score > 0) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 3, -Math.PI / 2, -Math.PI / 2 + (n.proof_score / 100) * Math.PI * 2);
          ctx.strokeStyle = "#22c55e80";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Label
        ctx.fillStyle = "#e2e8f0";
        ctx.font = `${Math.max(9, n.radius * 0.55)}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const label = n.skill_name.length > 10 ? n.skill_name.slice(0, 9) + "…" : n.skill_name;
        ctx.fillText(label, n.x, n.y + n.radius + 14);
      }

      animRef.current = requestAnimationFrame(simulate);
    };

    simulate();
    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
    };
  }, [dimensions, hoveredNode]);

  // Mouse interaction
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const found = graphNodesRef.current.find((n) => {
        const dx = n.x - x;
        const dy = n.y - y;
        return Math.sqrt(dx * dx + dy * dy) <= n.radius + 4;
      });
      setHoveredNode(found || null);
      canvas.style.cursor = found ? "pointer" : "default";
    },
    []
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (hoveredNode && onNodeClick) {
        onNodeClick(hoveredNode);
      }
    },
    [hoveredNode, onNodeClick]
  );

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[400px]">
      <canvas
        ref={canvasRef}
        style={{ width: dimensions.width, height: dimensions.height }}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        className="rounded-xl"
      />

      {/* Tooltip */}
      {hoveredNode && (
        <div
          className="absolute pointer-events-none z-50 px-4 py-3 rounded-xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl text-sm max-w-[260px]"
          style={{ left: hoveredNode.x + 20, top: hoveredNode.y - 20 }}
        >
          <div className="font-semibold text-white flex items-center gap-2">
            {hoveredNode.skill_name}
            {hoveredNode.is_verified && <span className="text-green-400 text-xs">✓ Verified</span>}
          </div>
          <div className="text-xs text-zinc-400 mt-1">
            {hoveredNode.skill_category} · {hoveredNode.proficiency_level}
          </div>
          <div className="flex gap-3 mt-2 text-xs">
            <span className="text-cyan-400">Proof: {hoveredNode.proof_score.toFixed(0)}%</span>
            <span className="text-amber-400">{hoveredNode.endorsement_count} endorsements</span>
          </div>
          {hoveredNode.projects.length > 0 && (
            <div className="mt-2 text-xs text-zinc-500">
              Used in: {hoveredNode.projects.map((p) => p.title).join(", ")}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-1 text-[10px] text-zinc-500">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            {cat.replace("_", " ")}
          </div>
        ))}
      </div>
    </div>
  );
}
