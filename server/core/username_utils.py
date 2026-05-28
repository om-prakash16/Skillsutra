import re
import random
import string
RESERVED_USERNAMES = {
    "admin", "administrator", "root", "support", "help", "info", "contact",
    "jobs", "company", "companies", "auth", "api", "dashboard", "settings",
    "profile", "profiles", "user", "users", "search", "talent", "bounties",
    "competitions", "verify", "pricing", "privacy", "terms", "about",
    "login", "signup", "register", "logout", "career-advice", "salary",
    "staff", "post-job", "roadmap", "challenges", "quiz", "u", "dev", "me"
}

def is_valid_username(username: str) -> bool:
    """Check if a username matches length and character requirements."""
    if not username or len(username) < 3 or len(username) > 30:
        return False
    # Only allow lowercase letters, numbers, hyphens, and underscores
    if not re.match(r"^[a-z0-9_-]+$", username):
        return False
    return True

def is_reserved_username(username: str) -> bool:
    """Check if a username is in the reserved list."""
    return username.lower() in RESERVED_USERNAMES

def generate_base_slug(full_name: str) -> str:
    """Generate a clean base slug from a full name."""
    if not full_name:
        return f"user-{generate_random_suffix(6)}"
    
    # Simple regex slugifier: lowercase, replace spaces with hyphens, remove non-alphanumeric
    slug = full_name.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug).strip('-')
    
    if not slug:
        return f"user-{generate_random_suffix(6)}"
        
    return slug

def generate_random_suffix(length: int = 4) -> str:
    """Generate a random alphanumeric suffix."""
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

def generate_unique_username(full_name: str, existing_usernames_check_func=None) -> str:
    """
    Generate a unique username.
    If existing_usernames_check_func is provided, it must be a callable that takes a username string
    and returns True if it exists in the database, False otherwise.
    """
    base_slug = generate_base_slug(full_name)
    
    # Try the base slug first if it's not reserved and valid length
    if not is_reserved_username(base_slug) and len(base_slug) >= 3:
        if existing_usernames_check_func is None or not existing_usernames_check_func(base_slug):
            return base_slug

    # Keep adding random suffixes until we find a unique one
    max_attempts = 10
    for _ in range(max_attempts):
        suffix = generate_random_suffix()
        candidate = f"{base_slug}-{suffix}"
        
        # Ensure we don't exceed max length
        if len(candidate) > 30:
            candidate = f"{base_slug[:30-len(suffix)-1]}-{suffix}"
            
        if not is_reserved_username(candidate):
            if existing_usernames_check_func is None or not existing_usernames_check_func(candidate):
                return candidate
                
    # Fallback if somehow everything is taken or too long
    return f"user-{generate_random_suffix(8)}"
