from .models import User
from .schemas import (
    UserSchemaCreate,
    UserSchemaUpdate,
    UserSchemaLogin,
)
from .repositories import UserRepository


class UserService:
    def __init__(self, user_repository: UserRepository) -> None:
        self._repository: UserRepository = user_repository

    def get_users(self) -> list[User]:
        return self._repository.get_all()

    def get_user(self, user_id: int) -> User:
        return self._repository.get_by_id(user_id)

    def create_user(self, user: UserSchemaCreate) -> User:
        return self._repository.add(user)

    def delete_user(self, user_id: int) -> None:
        return self._repository.delete_by_id(user_id)

    def login(self, user: UserSchemaLogin) -> User:
        return self._repository.login(user)

    def update_user(self, user_id: int, user: UserSchemaUpdate) -> User:
        return self._repository.update(user_id, user)