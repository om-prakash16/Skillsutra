import uuid
from typing import Optional
from core.supabase import get_supabase
from modules.nft.service import NFTService


class SyncService:
    def __init__(self):
        self.nft_service = NFTService()

    async def trigger_metadata_sync(
        self,
        user_id: uuid.UUID,
        entity_type: str,
        entity_id: Optional[uuid.UUID] = None,
    ):
        """
        Orchestrates simulated IPFS pinning and pending state management.
        """
        db = get_supabase()

        # 1. Fetch current data for metadata generation
        if entity_type == "profile":
            (
                db.table("users").select("*").eq("id", str(user_id)).single().execute()
            )
            metadata = await self.nft_service.generate_profile_metadata(
                str(user_id), []
            )
        elif entity_type == "skill" and entity_id:
            # Simulated skill metadata logic
            metadata = await self.nft_service.generate_skill_metadata(
                str(user_id), "Advanced Logic", 92, "Expert"
            )
        else:
            metadata = {"name": "Credential Meta", "type": entity_type}

        # 2. Upload to IPFS (Simulated)
        cid = await self.nft_service.upload_to_ipfs(metadata)

        # 3. Store in metadata_versions
        await self.nft_service.save_metadata_version(
            str(user_id), entity_type, metadata
        )

        # 4. Mark Sync Status as PENDING
        db.table("sync_status").upsert(
            {
                "user_id": str(user_id),
                "entity_type": entity_type,
                "entity_id": str(entity_id) if entity_id else None,
                "current_state": "pending",
                "latest_cid": cid,
                "updated_at": "now()",
            }
        ).execute()

        return {"status": "pending", "cid": cid}

    async def finalize_blockchain_sync(
        self, user_id: uuid.UUID, entity_type: str, tx_hash: str
    ):
        """
        Transition to SYNCED state after Solana transaction confirmation.
        """
        db = get_supabase()

        db.table("sync_status").update(
            {
                "current_state": "synced",
                "onchain_tx_hash": tx_hash,
                "last_synced_at": "now()",
                "error_message": None,
            }
        ).eq("user_id", str(user_id)).eq("entity_type", entity_type).execute()

        return {"status": "synced", "tx_hash": tx_hash}

    async def mark_sync_failed(self, user_id: uuid.UUID, entity_type: str, error: str):
        """
        Handle synchronization failures.
        """
        db = get_supabase()
        db.table("sync_status").update(
            {"current_state": "failed", "error_message": error}
        ).eq("user_id", str(user_id)).eq("entity_type", entity_type).execute()
