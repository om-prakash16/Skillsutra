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
    if not username or len(username) < 3 or len(username) > 50:
        return False
    # Strict regex: lowercase letters and numbers, hyphens allowed in between
    # No leading/trailing hyphens, no underscores, no special characters
    if not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", username):
        return False
    return True

def is_reserved_username(username: str) -> bool:
    """Check if a username is in the reserved list."""
    return username.lower() in RESERVED_USERNAMES

def generate_base_slug(raw_name: str) -> str:
    """Generate a clean base slug from a full name or email."""
    if not raw_name:
        return f"user-{generate_random_suffix(6)}"
    
    # Simple regex slugifier: lowercase, replace spaces with hyphens, remove non-alphanumeric
    slug = raw_name.lower()
    
    # Replace anything that isn't a letter or number with a hyphen
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    # Collapse multiple hyphens into a single hyphen
    slug = re.sub(r'-+', '-', slug)
    # Strip leading/trailing hyphens
    slug = slug.strip('-')
    
    if not slug:
        return f"user-{generate_random_suffix(6)}"
        
    return slug

def generate_random_suffix(length: int = 4) -> str:
    """Generate a random alphanumeric suffix."""
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

async def generate_unique_username(raw_name: str, existing_usernames_check_func=None) -> str:
    """
    Generate a unique username by slugifying the input and appending -1, -2 incrementally if taken.
    If existing_usernames_check_func is provided, it must be an ASYNC callable.
    """
    base_slug = generate_base_slug(raw_name)
    
    # Trim base slug to allow room for suffixes (max length is 50)
    # Give a buffer of 5 characters for suffixes e.g., "-9999"
    if len(base_slug) > 45:
        base_slug = base_slug[:45].rstrip('-')
    
    # Try the base slug first if it's not reserved and valid length
    if not is_reserved_username(base_slug) and len(base_slug) >= 3:
        if existing_usernames_check_func is None:
            return base_slug
        is_taken = await existing_usernames_check_func(base_slug)
        if not is_taken:
            return base_slug

    # Keep adding incremental suffixes until we find a unique one
    max_attempts = 1000
    for suffix in range(1, max_attempts + 1):
        candidate = f"{base_slug}-{suffix}"
            
        if not is_reserved_username(candidate):
            if existing_usernames_check_func is None:
                return candidate
            is_taken = await existing_usernames_check_func(candidate)
            if not is_taken:
                return candidate
                
    # Fallback if somehow everything is taken
    return f"user-{generate_random_suffix(8)}"
