const modelAnswers = [
  {
    "SQL": {
      "code": "SELECT id, COUNT(*) AS row_count\nFROM listings\nGROUP BY id\nHAVING COUNT(*) > 1;",
      "explanation": "id별로 행을 묶고 개수를 센 뒤 2개 이상인 그룹만 보여줘요. 결과가 없으면 중복 id가 발견되지 않은 것이에요. 이것만으로 적재 오류 원인까지 확정할 수는 없어요."
    },
    "Python": {
      "code": "import pandas as pd\n\ndf = pd.read_csv(\"listings.csv\")\nduplicates = df[df.duplicated(subset=[\"id\"], keep=False)]\nprint(duplicates)",
      "explanation": "df는 CSV를 읽어 만든 표예요. duplicated는 같은 id가 있는 행을 표시해요. keep=False는 중복 그룹의 첫 행까지 모두 표시해요. df[조건]은 그 행들만 골라요. 출력이 비어 있으면 중복 id가 발견되지 않은 것이에요. 이 코드는 삭제하지 않고 확인만 해요."
    }
  },
  {
    "SQL": {
      "code": "SELECT room_type,\n       COUNT(*) FILTER (WHERE price IS NULL) AS missing_price\nFROM listings\nGROUP BY room_type;",
      "explanation": "방 유형별로 묶은 후 가격이 NULL인 행만 세어요. 결측이 없는 유형도 0으로 표시돼요."
    },
    "Python": {
      "code": "import pandas as pd\n\ndf = pd.read_csv(\"listings.csv\")\nmissing_price = df[df[\"price\"].isna()]\nprint(missing_price)",
      "explanation": "isna()는 가격이 비어 있으면 True를 반환해요. 바깥쪽 df[조건]은 True인 행만 고릅니다."
    }
  },
  {
    "SQL": {
      "code": "SELECT *\nFROM listings\nWHERE id IS NULL;",
      "explanation": "NULL은 값이 없다는 뜻이에요. = NULL 대신 IS NULL을 써요. 빈 문자열이나 공백은 별도 검사해야 해요."
    },
    "Python": {
      "code": "import logging\nimport pandas as pd\n\nlogging.basicConfig(level=logging.INFO)\ntry:\n    df = pd.read_csv(\"listings.csv\")\nexcept FileNotFoundError:\n    logging.exception(\"CSV 파일을 찾을 수 없습니다\")\n    raise",
      "explanation": "try 안에서 읽기를 시도해요. 파일이 없으면 except에서 오류와 실행 위치를 기록해요. raise는 실패를 호출한 쪽에도 알려서 다음 단계로 넘어가지 않게 해요."
    }
  },
  {
    "SQL": {
      "code": "CREATE TABLE listings_target (\n    id BIGINT PRIMARY KEY,\n    price NUMERIC\n);",
      "explanation": "PRIMARY KEY는 id의 중복과 NULL을 막아요. 예시는 새 테이블용이며 이미 같은 이름의 테이블이 있으면 생성에 실패해요."
    },
    "Python": {
      "code": "import pandas as pd\n\ndf = pd.read_csv(\"listings.csv\", dtype={\"id\": \"string\"})\nconverted = pd.to_numeric(df[\"id\"], errors=\"coerce\")\ninvalid = df[df[\"id\"].notna() & converted.isna()]\nprint(invalid)",
      "explanation": "숫자로 바뀌지 않는 값을 결측값으로 바꿔요. 원래 값이 있었는데 변환 후 결측이 된 행이 잘못된 문자열 후보예요. 정수 여부와 범위는 추가 검사해야 해요."
    }
  },
  {
    "SQL": {
      "code": "INSERT INTO target (id, price)\nSELECT id, price\nFROM staging\nWHERE price IS NOT NULL;",
      "explanation": "원본 임시 테이블에서 가격이 있는 행만 골라 목적지에 넣어요. staging과 target에 id·price 열이 있고 자료형이 호환된다는 가정이에요. 재실행 시 중복 처리는 별도로 필요해요."
    },
    "Python": {
      "code": "import pandas as pd\n\ndef extract(path):\n    return pd.read_csv(path)\n\ndef transform(df):\n    return df.dropna(subset=[\"price\"])\n\ndef load(df, path):\n    df.to_csv(path, index=False)\n\nraw = extract(\"listings.csv\")\nclean = transform(raw)\nload(clean, \"clean_listings.csv\")",
      "explanation": "앞 단계의 출력을 다음 함수에 넘겨요. 이 작은 예시는 파일로 저장하는 ETL이에요. 실제 데이터베이스 적재는 load 함수를 바꿔 연결해요."
    }
  },
  {
    "SQL": {
      "code": "INSERT INTO target (id, price)\nVALUES (101, 150)\nON CONFLICT (id) DO UPDATE\nSET price = EXCLUDED.price;",
      "explanation": "id가 없으면 추가하고, 이미 있으면 새 가격으로 갱신해요. target.id에 PRIMARY KEY 또는 UNIQUE 제약조건이 필요해요. 101과 150은 설명용 예시 값이에요."
    },
    "Python": {
      "code": "import os\nimport psycopg\n\n# psycopg 설치 및 DATABASE_URL 환경 변수 설정 필요\nwith psycopg.connect(os.environ[\"DATABASE_URL\"]) as conn:\n    with conn.cursor() as cur:\n        cur.execute(\"INSERT INTO target (id, price) VALUES (%s, %s)\", (101, 150))\n        cur.execute(\"INSERT INTO target (id, price) VALUES (%s, %s)\", (102, 180))",
      "explanation": "연결의 with 블록이 정상 종료되면 두 문장을 함께 확정해요. 중간에 예외가 밖으로 전달되면 트랜잭션을 되돌려요. 이 예시는 트랜잭션 설명용으로, 재실행을 위한 upsert는 별도로 추가해야 해요."
    }
  },
  {
    "SQL": {
      "code": "SELECT COUNT(*) AS total_rows,\n       COUNT(DISTINCT id) AS unique_ids\nFROM listings;",
      "explanation": "전체 행 수와 고유한 id 수를 나란히 확인해요. COUNT(DISTINCT id)는 NULL을 세지 않으므로 두 수가 다르다고 중복만 원인이라고 확정하면 안 돼요."
    },
    "Python": {
      "code": "import requests\n\n# url은 실제 API 주소로 먼저 설정하세요.\ntry:\n    response = requests.get(url, timeout=10)\n    response.raise_for_status()\nexcept requests.exceptions.RequestException:\n    raise",
      "explanation": "timeout으로 무한 대기를 피하고 HTTP 오류도 확인해요. 10초는 예시이며 전체 작업의 엄격한 총 시간 제한은 아니에요. url과 requests 설치가 필요해요."
    }
  },
  {
    "SQL": {
      "code": "SELECT COUNT(*) AS total_rows\nFROM target;",
      "explanation": "COUNT(*)는 NULL을 포함해 테이블의 모든 행을 세어요. 적재가 성공한 다음 확인해야 해요."
    },
    "Python": {
      "code": "# 수집·적재·검증 함수가 정의되어 있다는 전제의 실행 순서 예시\ndef run_pipeline():\n    data = collect()\n    load(data)  # 실패하면 예외를 발생시켜야 해요\n    validate()\n\nrun_pipeline()",
      "explanation": "load에서 예외가 밖으로 전달되면 validate를 실행하지 않아요. collect, load, validate는 프로젝트에서 구현해야 하는 함수예요."
    }
  },
  {
    "SQL": {
      "code": "SELECT COUNT(*) AS missing_ids\nFROM target\nWHERE id IS NULL;",
      "explanation": "이 결과가 0이어야 한다는 규칙을 실행 코드에서 확인해요. SELECT 자체가 자동으로 파이프라인을 중단하지는 않아요."
    },
    "Python": {
      "code": "import pandas as pd\n\ndf = pd.read_csv(\"listings.csv\")\nif df[\"id\"].isna().any():\n    raise ValueError(\"id 결측값이 있습니다\")",
      "explanation": "isna()로 각 행의 결측 여부를 확인해요. any()는 하나라도 True면 True가 되고, ValueError로 작업을 중단해요."
    }
  },
  {
    "SQL": {
      "code": "읽기 전용 검증 계정에는 INSERT 권한이 필요하지 않아요.\n검사 대상에 대한 SELECT 등 필요한 읽기 권한만 부여해요.",
      "explanation": "검증만 하는 계정이 데이터를 바꿀 이유는 없어요. 실제 PostgreSQL에서는 접속 권한과 스키마 접근 권한도 필요할 수 있어요."
    },
    "Python": {
      "code": "import os\n\ndatabase_url = os.environ[\"DATABASE_URL\"]\n# 비밀 값은 출력하거나 저장소에 올리지 마세요.",
      "explanation": "비밀번호를 소스 코드에 적지 않고 실행 환경에서 읽어요. 환경 변수가 없으면 KeyError가 발생해요. 실제 값은 실행 환경에 미리 설정해야 해요."
    }
  },
  {
    "SQL": {
      "code": "SELECT COUNT(*) AS staging_rows FROM staging;\nSELECT COUNT(*) AS target_rows FROM target;",
      "explanation": "같은 배치와 같은 필터 기준으로 비교해야 해요. 의도적으로 제외한 행이 있으면 그 차이도 설명해야 해요. 행 수가 같아도 내용이 같다고 보장되지는 않아요."
    },
    "Python": {
      "code": "import pandas as pd\n\ndf = pd.read_csv(\"downloaded_listings.csv\")\nrequired = {\"id\", \"price\", \"room_type\"}\nmissing = required - set(df.columns)\nif missing:\n    raise ValueError(f\"필수 열 누락: {sorted(missing)}\")",
      "explanation": "다운로드한 파일을 읽었다는 전제예요. 필수 열에서 실제 열을 빼면 빠진 열이 남아요. 남은 열이 있으면 적재 전에 중단해요."
    }
  },
  {
    "SQL": {
      "code": "SELECT *\nFROM listings\nWHERE price > 0;",
      "explanation": "0 이하인 가격을 제외해요. NULL은 비교 결과가 참이 아니어서 함께 제외돼요. price가 숫자 자료형이라는 가정이에요."
    },
    "Python": {
      "code": "import pandas as pd\n\ndf = pd.read_csv(\"listings.csv\")\ndf[\"price_original\"] = df[\"price\"]\ntext = df[\"price\"].astype(\"string\")\ntext = text.str.replace(\"$\", \"\", regex=False)\ntext = text.str.replace(\",\", \"\", regex=False)\ndf[\"price\"] = pd.to_numeric(text, errors=\"coerce\")\nprint(df[[\"price_original\", \"price\"]].head())",
      "explanation": "원본을 보관한 뒤 달러 기호와 천 단위 쉼표를 제거해 숫자로 바꿔요. $1,200.00 형식의 예시예요. 변환 실패는 결측이 되므로 따로 확인해야 하고, 다른 통화·소수점 형식은 별도 규칙이 필요해요."
    }
  },
  {
    "SQL": {
      "code": "SELECT id, COUNT(*) AS row_count\nFROM target\nGROUP BY id\nHAVING COUNT(*) > 1;\n\nSELECT COUNT(*) AS missing_ids\nFROM target\nWHERE id IS NULL;",
      "explanation": "첫 검사는 중복 id, 두 번째는 빈 id를 찾아요. 둘 다 문제가 없어도 최신 버전이라는 사실까지 증명하지는 못해요. 최신성은 원본과 갱신 시각 또는 버전을 비교하는 별도 검사가 필요해요."
    },
    "Python": {
      "code": "from datetime import datetime, timezone\n\nrecord = {\n    \"stage\": \"extract\",\n    \"source\": \"listings.csv\",\n    \"target\": \"staging\",\n    \"row_count\": 100,  # 실제 실행에서 계산한 값으로 교체\n    \"started_at\": datetime.now(timezone.utc).isoformat(),\n    \"error\": None,\n}\nprint(record)",
      "explanation": "단계와 입력·출력, 행 수, 시간을 함께 기록하면 어디서 문제가 생겼는지 찾기 쉬워요. 100은 설명용 값이며 실제 결과가 아니에요. 실제 실행에서는 계산한 값과 종료 상태를 기록해요."
    }
  },
  {
    "SQL": {
      "code": "SELECT\n    COUNT(*) FILTER (WHERE price IS NULL) AS missing_rows,\n    COUNT(*) AS total_rows,\n    100.0 * COUNT(*) FILTER (WHERE price IS NULL)\n      / NULLIF(COUNT(*), 0) AS missing_percent\nFROM target;",
      "explanation": "분자는 결측 행 수, 분모는 전체 행 수예요. 100.0을 곱하면 백분율이 돼요. 빈 테이블은 NULLIF로 0 나누기를 피하며 비율이 NULL로 나와요."
    },
    "Python": {
      "code": "import logging\n\nlogging.basicConfig(level=logging.INFO)\n# 다음 코드는 run_id, source_path, load_data가 준비된 실행부 예시예요.\ntry:\n    load_data(source_path)\nexcept Exception:\n    logging.exception(\"실행=%s 단계=load 파일=%s\", run_id, source_path)\n    raise",
      "explanation": "실행 식별자·단계·파일과 오류의 실행 위치를 기록해요. raise로 실패를 전달해 성공으로 처리되지 않게 해요. 실제 함수와 변수를 먼저 준비해야 해요."
    }
  },
  {
    "SQL": {
      "code": "SELECT COUNT(*) AS total_rows FROM target;\n\n보장: 현재 테이블의 전체 행 수를 알 수 있어요.\n보장하지 못함: 값의 정확성, 중복 없음, 원본과 동일함, 최신성.",
      "explanation": "검사 하나가 확인하는 범위를 분명히 설명하는 것이 중요해요. 행 수 검사만으로 모든 품질을 확인했다고 말하면 안 돼요."
    },
    "Python": {
      "code": "재현을 위해 README에 기록할 내용:\n1. 실제 사용한 Python 버전\n2. 의존성 목록과 설치 방법\n3. 비밀 값이 없는 환경 변수 예시\n4. 표본 데이터 위치와 필요한 열\n5. 데이터베이스 준비 방법\n6. 실행 명령과 예상 검증 결과",
      "explanation": "코드만 있어도 다른 환경에서는 실행이 안 될 수 있어요. 버전·설정·입력·실행 순서를 함께 남겨야 다른 사람이 재현할 수 있어요. 비밀번호는 예시 파일에도 넣지 않아요."
    }
  }
];
