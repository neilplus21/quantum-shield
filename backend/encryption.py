import json
import os
import base64
from datetime import datetime
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from kyber_py.ml_kem import ML_KEM_512
from web3 import Web3
from dotenv import load_dotenv
load_dotenv()

#details
PRIVATE_KEY = os.getenv("pvtkey")
SENDER_ADDRESS = os.getenv("SENDER_ADDRESS")
RPC_URL = os.getenv("RPC_URL")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")

# ABI
ABI = [
    {
        "inputs": [
            {"internalType": "address", "name": "receiver", "type": "address"},
            {"internalType": "string", "name": "plaintext", "type": "string"}
        ],
        "name": "logEncryptedTransaction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

# Sample IoT Data
iot_data = {
    "device_id": "iot-001",
    "temperature": 26.5,
    "status": "active",
    "timestamp": datetime.utcnow().isoformat()
}

#encryption

def encrypt_iot_data(data):
    ek, dk = ML_KEM_512.keygen()
    shared_key, ct = ML_KEM_512.encaps(ek)

    aes_key = shared_key[:32]
    iv = get_random_bytes(12)
    cipher = AES.new(aes_key, AES.MODE_GCM, nonce=iv)
    plaintext = json.dumps(data).encode()
    ciphertext, tag = cipher.encrypt_and_digest(plaintext)

    encrypted_package = {
        "ciphertext": base64.b64encode(ciphertext).decode(), #the real data 
        "iv": base64.b64encode(iv).decode(),#intialization vector
        "tag": base64.b64encode(tag).decode(),#authentication tag
        "kem_ciphertext": base64.b64encode(ct).decode()#encrypted aes key
    }

    return json.dumps(encrypted_package)

#send to blockchain

def send_transaction(receiver, encrypted_payload):
    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    if not w3.is_connected():
        raise Exception("Ethereum RPC connection failed")

    contract = w3.eth.contract(address=Web3.to_checksum_address(CONTRACT_ADDRESS), abi=ABI)
    nonce = w3.eth.get_transaction_count(SENDER_ADDRESS)

    txn = contract.functions.logEncryptedTransaction(receiver, encrypted_payload).build_transaction({
        'from': SENDER_ADDRESS,
        'nonce': nonce,
        'gas': 300000,
        'gasPrice': w3.to_wei('10', 'gwei')
    })

    signed_txn = w3.eth.account.sign_transaction(
        txn,
        private_key=PRIVATE_KEY
    )

    tx_hash = w3.eth.send_raw_transaction(
        signed_txn.raw_transaction
    )

    tx_hash_hex = w3.to_hex(tx_hash)

    print("Transaction sent! Tx Hash:", tx_hash_hex)

    return tx_hash_hex


if __name__ == "__main__":
    encrypted_payload = encrypt_iot_data(iot_data)
    receiver_address = SENDER_ADDRESS  # or any other test wallet
    tx_hash = send_transaction(receiver_address, encrypted_payload)

    print("TX Hash:", tx_hash)
