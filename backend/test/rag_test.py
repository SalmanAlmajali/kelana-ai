import sys
import os

# Add backend directory to path so we can import services
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.kb_service import KnowledgeBaseService
from services.bedrock_service import BedrockService

questions = [
    "Apa saja dokumen wajib yang harus dibawa saat apply visa turis Jepang (single-entry)?",
    "Berapa lama waktu proses pembuatan visa kunjungan singkat ke Jepang?",
    "Apakah saya wajib melampirkan surat undangan (invitation letter) untuk visa turis Jepang?",
    "Berapa maksimal durasi tinggal untuk visa kunjungan singkat (short-term visa) di Jepang?",
    "Apakah tiket penerbangan pulang-pergi (round-trip) wajib dilampirkan sebagai syarat dokumen?"
]

kb = KnowledgeBaseService()

with open("rag_results.md", "w", encoding="utf-8") as f:
    f.write("# Hasil Pengujian RAG vs Base Model\n\n")
    
    for i, q in enumerate(questions):
        print(f"Testing Question {i+1}...")
        
        # 1. RAG
        context, docs = kb.get_context(q)
        
        prompt_rag = (
            "You are a helpful travel assistant.\n\n"
            "Answer the users question based on the context below.\n"
            "If the answer is not in the context, say so.\n"
            "Do not answer questions that are not related to travel.\n\n"
            f"Context:\n{context}\n\n"
            f"Question:\n{q}\n\n"
            "- Return ONLY the answer text, just pure text"
        )
        
        ans_rag = BedrockService.get_ai_recommendation(None, prompt_rag)
        
        # 2. Base Model
        prompt_base = (
            "You are a helpful travel assistant.\n\n"
            f"Question:\n{q}\n\n"
            "- Return ONLY the answer text, just pure text"
        )
        ans_base = BedrockService.get_ai_recommendation(None, prompt_base)
        
        # Write to file
        f.write(f"## Pertanyaan {i+1}\n**{q}**\n\n")
        f.write("### ❌ Tanpa Knowledge Base (Base Model)\n")
        f.write(f"{ans_base}\n\n")
        f.write("### ✅ Dengan Knowledge Base (RAG)\n")
        f.write(f"{ans_rag}\n\n")
        f.write(f"**Dokumen Sumber**: `{', '.join(docs) if docs else 'Tidak ada'}`\n\n")
        f.write("---\n\n")

print("Done! Results written to rag_results.md")
