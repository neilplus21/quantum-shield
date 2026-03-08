from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from encryption import encrypt_iot_data, send_transaction, iot_data, SENDER_ADDRESS

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/run-demo")
def run_demo():

    encrypted_payload = encrypt_iot_data(iot_data)

    tx_hash = send_transaction(
        SENDER_ADDRESS,
        encrypted_payload
    )

    return {
        "iot_data": iot_data,
        "encrypted_payload": encrypted_payload,
        "tx_hash": tx_hash
    }