import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

SERVER = os.getenv("DB_SERVER")
DATABASE = os.getenv("DB_NAME")
# Thêm 2 dòng này để lấy thông tin đăng nhập
USER = os.getenv("DB_USER")
PASSWORD = os.getenv("DB_PASSWORD")

print("KIỂM TRA SERVER:", SERVER)
print("KIỂM TRA DATABASE:", DATABASE)
# Có thể print thêm dòng này để test xem nó nhận pass chưa (sau khi chạy OK thì nên xóa đi cho bảo mật)
# print("KIỂM TRA USER:", USER) 

# CÚ PHÁP MỚI: mssql+pyodbc://{USER}:{PASSWORD}@{SERVER}/{DATABASE}
SQLALCHEMY_DATABASE_URL = f"mssql+pyodbc://{USER}:{PASSWORD}@{SERVER}/{DATABASE}?driver=ODBC+Driver+17+for+SQL+Server"

engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()