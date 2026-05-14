def normalize_email(email: str) -> str:
	return email.strip().lower()


def parse_cors_origins(origins_csv: str) -> list[str]:
	return [item.strip() for item in origins_csv.split(",") if item.strip()]
