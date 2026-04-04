"""
User Panel API Routes.
Handles profile CRUD, IPFS sync, privacy controls, and profile snapshots.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from db.supabase_client import get_supabase
from datetime import datetime
import hashlib
import json

router = APIRouter()

# ─── Models ───────────────────────────────────────────────────────────
class ProfileUpdate(BaseModel):
    wallet_address: str
    profile_data: Dict[str, Any]

class PrivacySettings(BaseModel):
    profile_visibility: str = "public"  # public | private | recruiter_only
    wallet_address_visible: bool = False
    reputation_score_visible: bool = True
    nft_credentials_visible: bool = True
    fields: Dict[str, str] = {}  # field_key -> "public" | "private" | "recruiter_only"

class SyncNFTRequest(BaseModel):
    wallet_address: str
    tx_signature: str
    new_cid: str

# ─── Profile Endpoints ───────────────────────────────────────────────

@router.get("/profile")
async def get_user_profile(wallet: str = "", user_id: str = ""):
    """Fetch user profile by wallet address or user ID."""
    db = get_supabase()
    if not db:
        return {
            "wallet_address": wallet or "demo_wallet",
            "full_name": "Demo User",
            "bio": "Full-stack Solana developer with 5 years of experience.",
            "reputation_score": 742,
            "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
            "location": "Remote",
            "skills": ["Rust", "Solana", "TypeScript", "Next.js", "Python"],
            "current_ipfs_cid": "QmMockCID123",
            "dynamic_fields": {
                "github_handle": "demodev",
                "leetcode_url": "https://leetcode.com/demo",
                "hackathon_participation": "ETHIndia 2024 Winner"
            },
            "privacy_settings": {
                "profile_visibility": "public",
                "wallet_address_visible": False,
                "reputation_score_visible": True,
                "nft_credentials_visible": True,
                "fields": {}
            }
        }

    query = db.table("users").select("*")
    if wallet:
        query = query.eq("wallet_address", wallet)
    elif user_id:
        query = query.eq("id", user_id)
    else:
        raise HTTPException(status_code=400, detail="Provide wallet or user_id")

    response = query.single().execute()
    return response.data


@router.post("/profile/update")
async def update_profile(data: ProfileUpdate):
    """Save profile data and generate IPFS metadata CID."""
    db = get_supabase()

    # Generate metadata for IPFS
    metadata = {
        "name": f"SkillProof AI Profile",
        "description": "AI-Verified Professional Profile",
        "attributes": [
            {"trait_type": k, "value": v}
            for k, v in data.profile_data.items()
            if v is not None
        ],
        "updated_at": datetime.utcnow().isoformat()
    }
    
    # Generate a deterministic CID (mock for now)
    metadata_json = json.dumps(metadata, sort_keys=True)
    mock_cid = "Qm" + hashlib.sha256(metadata_json.encode()).hexdigest()[:44]

    if not db:
        return {
            "status": "success",
            "new_cid": mock_cid,
            "version": 1,
            "ready_to_sync": True,
            "message": "Profile updated (mock mode)"
        }

    # Update the user's dynamic fields
    db.table("users").update({
        "dynamic_fields": data.profile_data,
        "current_ipfs_cid": mock_cid
    }).eq("wallet_address", data.wallet_address).execute()

    # Get current version number
    snapshots = db.table("profile_snapshots").select("version") \
        .eq("wallet_address", data.wallet_address) \
        .order("version", desc=True).limit(1).execute()
    
    version = (snapshots.data[0]["version"] + 1) if snapshots.data else 1

    # Create snapshot
    db.table("profile_snapshots").insert({
        "wallet_address": data.wallet_address,
        "version": version,
        "ipfs_cid": mock_cid,
        "change_summary": {"changed_fields": list(data.profile_data.keys())}
    }).execute()

    return {
        "status": "success",
        "new_cid": mock_cid,
        "version": version,
        "ready_to_sync": True
    }


@router.post("/profile/sync-nft")
async def sync_nft(data: SyncNFTRequest):
    """Confirm on-chain sync after Solana transaction."""
    db = get_supabase()
    if not db:
        return {
            "status": "synced",
            "on_chain_tx": data.tx_signature,
            "message": "NFT metadata updated (mock mode)"
        }

    # Update latest snapshot with tx sig
    db.table("profile_snapshots").update({
        "on_chain_tx_sig": data.tx_signature
    }).eq("wallet_address", data.wallet_address) \
      .eq("ipfs_cid", data.new_cid).execute()

    return {"status": "synced", "on_chain_tx": data.tx_signature}


@router.get("/profile/snapshots")
async def get_profile_snapshots(wallet: str):
    """Get version history of profile metadata."""
    db = get_supabase()
    if not db:
        return [
            {"version": 3, "ipfs_cid": "QmABC123", "on_chain_tx_sig": "5wK...abc", "created_at": "2026-04-03T10:00:00"},
            {"version": 2, "ipfs_cid": "QmDEF456", "on_chain_tx_sig": "3rJ...def", "created_at": "2026-04-01T08:30:00"},
            {"version": 1, "ipfs_cid": "QmGHI789", "on_chain_tx_sig": "7hZ...ghi", "created_at": "2026-03-28T14:15:00"},
        ]

    response = db.table("profile_snapshots").select("*") \
        .eq("wallet_address", wallet) \
        .order("version", desc=True).execute()
    return response.data


@router.patch("/profile/privacy")
async def update_privacy(wallet: str, settings: PrivacySettings):
    """Update user privacy settings."""
    db = get_supabase()
    if not db:
        return {"status": "mock", "settings": settings.model_dump()}

    db.table("users").update({
        "privacy_settings": settings.model_dump()
    }).eq("wallet_address", wallet).execute()

    return {"status": "success", "settings": settings.model_dump()}


@router.get("/profile/privacy")
async def get_privacy(wallet: str):
    """Get user privacy settings."""
    db = get_supabase()
    if not db:
        return {
            "profile_visibility": "public",
            "wallet_address_visible": False,
            "reputation_score_visible": True,
            "nft_credentials_visible": True,
            "fields": {}
        }

    response = db.table("users").select("privacy_settings") \
        .eq("wallet_address", wallet).single().execute()
    return response.data.get("privacy_settings", {})
