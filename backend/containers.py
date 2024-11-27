from dependency_injector import containers, providers
from dotenv import load_dotenv
from db import Database
from Users.repositories import UserRepository
from Users.services import UserService
from Mushrooms.repositories import MushroomRepository
from Mushrooms.services import MushroomService
from History.repositories import HistoryRepository
from History.services import HistoryService

load_dotenv()

class Container(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(modules=["Users.routes", "Mushrooms.routes", "History.routes", "Predictions.routes"])
    config = providers.Configuration()
    config.db.url.from_env("DATABASE_URL")
    db = providers.Singleton(Database, url=config.db.url)

    user_repository = providers.Factory(
        UserRepository, session_factory=db.provided.session
    )

    user_service = providers.Factory(
        UserService,
        user_repository=user_repository,
    )

    mushroom_repository = providers.Factory(
        MushroomRepository, session_factory=db.provided.session
    )

    mushroom_service = providers.Factory(
        MushroomService,
        mushroom_repository=mushroom_repository,
    )

    history_repository = providers.Factory(
        HistoryRepository, session_factory=db.provided.session
    )
    
    history_service = providers.Factory(
        HistoryService,
        history_repository=history_repository,
    )

    