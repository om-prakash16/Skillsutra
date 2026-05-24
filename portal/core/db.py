"""
Database access module for portal.
"""
import os

class MockDbClient:
    def table(self, name):
        return self
    def select(self, *args, **kwargs):
        return self
    def insert(self, *args, **kwargs):
        return self
    def update(self, *args, **kwargs):
        return self
    def delete(self, *args, **kwargs):
        return self
    def eq(self, *args, **kwargs):
        return self
    def execute(self):
        return {"data": [], "error": None}

_client = MockDbClient()

def get_db():
    return _client
