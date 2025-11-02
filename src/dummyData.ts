import type { AppState } from "./types";

export const dummyData: AppState = {
  "rootIds": ["science", "art"],
  "nodes": {
    "science": {
      "id": "science",
      "title": "Science",
      "content": "A systematic enterprise that builds and organizes knowledge.",
      "type": "branch",
      "parent": null,
      "children": ["physics", "biology"]
    },

    "physics": {
      "id": "physics",
      "title": "Physics",
      "content": "The study of matter, energy, and the fundamental forces of nature.",
      "type": "branch",
      "parent": "science",
      "children": ["quantum_mechanics", "relativity"]
    },

    "quantum_mechanics": {
      "id": "quantum_mechanics",
      "title": "Quantum Mechanics",
      "content": "Explores physical phenomena at microscopic scales using probabilistic models.",
      "type": "leaf",
      "parent": "physics",
      "children": ["schrodinger_equation", "wave_particle_duality"]
    },

    "schrodinger_equation": {
      "id": "schrodinger_equation",
      "title": "Schrödinger Equation",
      "content": "Describes how the quantum state of a system changes over time.",
      "type": "leaf",
      "parent": "quantum_mechanics",
      "children": []
    },

    "wave_particle_duality": {
      "id": "wave_particle_duality",
      "title": "Wave–Particle Duality",
      "content": "The concept that particles like electrons and photons exhibit both wave and particle properties.",
      "type": "leaf",
      "parent": "quantum_mechanics",
      "children": []
    },

    "relativity": {
      "id": "relativity",
      "title": "Relativity",
      "content": "A theory explaining the relationships between space, time, and gravity.",
      "type": "branch",
      "parent": "physics",
      "children": ["special_relativity", "general_relativity"]
    },

    "special_relativity": {
      "id": "special_relativity",
      "title": "Special Relativity",
      "content": "Describes how time and space are linked for objects moving at constant speeds.",
      "type": "leaf",
      "parent": "relativity",
      "children": []
    },

    "general_relativity": {
      "id": "general_relativity",
      "title": "General Relativity",
      "content": "Explains gravity as the curvature of spacetime caused by mass and energy.",
      "type": "leaf",
      "parent": "relativity",
      "children": []
    },

    "biology": {
      "id": "biology",
      "title": "Biology",
      "content": "The study of living organisms and their vital processes.",
      "type": "branch",
      "parent": "science",
      "children": ["genetics", "ecology"]
    },

    "genetics": {
      "id": "genetics",
      "title": "Genetics",
      "content": "Focuses on heredity and variation in organisms.",
      "type": "branch",
      "parent": "biology",
      "children": ["dna_structure", "gene_expression"]
    },

    "dna_structure": {
      "id": "dna_structure",
      "title": "DNA Structure",
      "content": "Double-helix molecule carrying genetic instructions for life.",
      "type": "leaf",
      "parent": "genetics",
      "children": []
    },

    "gene_expression": {
      "id": "gene_expression",
      "title": "Gene Expression",
      "content": "The process by which information from a gene is used to synthesize functional products.",
      "type": "leaf",
      "parent": "genetics",
      "children": []
    },

    "ecology": {
      "id": "ecology",
      "title": "Ecology",
      "content": "Examines how organisms interact with each other and their environment.",
      "type": "leaf",
      "parent": "biology",
      "children": []
    },

    "art": {
      "id": "art",
      "title": "Art",
      "content": "Creative expression through various mediums such as painting, sculpture, and music.",
      "type": "branch",
      "parent": null,
      "children": ["visual_art", "music"]
    },

    "visual_art": {
      "id": "visual_art",
      "title": "Visual Art",
      "content": "Art forms that focus on visual perception, including painting and sculpture.",
      "type": "branch",
      "parent": "art",
      "children": ["painting", "sculpture"]
    },

    "painting": {
      "id": "painting",
      "title": "Painting",
      "content": "The practice of applying pigment to a surface to create expressive or representational imagery.",
      "type": "leaf",
      "parent": "visual_art",
      "children": []
    },

    "sculpture": {
      "id": "sculpture",
      "title": "Sculpture",
      "content": "Three-dimensional artwork created by shaping materials such as stone, metal, or clay.",
      "type": "leaf",
      "parent": "visual_art",
      "children": []
    },

    "music": {
      "id": "music",
      "title": "Music",
      "content": "An art form that uses sound, rhythm, and melody to convey emotion and ideas.",
      "type": "branch",
      "parent": "art",
      "children": ["classical", "jazz"]
    },

    "classical": {
      "id": "classical",
      "title": "Classical Music",
      "content": "A broad term for Western art music traditions, typically orchestral and structured.",
      "type": "leaf",
      "parent": "music",
      "children": []
    },

    "jazz": {
      "id": "jazz",
      "title": "Jazz",
      "content": "A genre characterized by swing, improvisation, and strong rhythmic patterns.",
      "type": "leaf",
      "parent": "music",
      "children": []
    }
  }
}
