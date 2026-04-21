import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

# 1. Lấy thông tin từ file .env (hoặc nhập trực tiếp nếu chưa có .env)
DB_USER = os.getenv("DB_USER", "root") # Mặc định là root
DB_PASSWORD = os.getenv("DB_PASSWORD", "321300") # Thay bằng mật khẩu MySQL của bạn
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "ecommerce_db")

print(f"--- ĐANG KẾT NỐI DATABASE: {DB_NAME} ---")

# 2. Đổi URL từ mssql sang mysql
# Chúng ta sử dụng thư viện pymysql để Python nói chuyện được với MySQL
SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# 3. Khởi tạo engine
engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()