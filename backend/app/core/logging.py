import logging


def configure_logging(level: str = "INFO") -> None:
	log_level = getattr(logging, level.upper(), logging.INFO)
	logging.basicConfig(
		level=log_level,
		format="%(asctime)s %(levelname)s %(name)s %(message)s",
	)
