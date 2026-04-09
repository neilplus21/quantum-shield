# Add these imports at the top of the file
from collections import defaultdict
import threading
import json
import copy

# Add these global variables after the existing global variables
pbft_view_number = 0  # Current view number
pbft_sequence_number = 0  # Current sequence number
pbft_prepared = defaultdict(set)  # Track prepare messages {seq_num: {replica_ids}}
pbft_committed = defaultdict(set)  # Track commit messages {seq_num: {replica_ids}}
pbft_checkpoints = {}  # Track stable checkpoints
pbft_lock = threading.Lock()  # Lock for thread safety

# Add these PBFT-specific functions

def pbft_generate_block(miner_id, transactions, previous_hash, blockNo):
    """Generate a new block using PBFT consensus"""
    global pbft_sequence_number
    
    with pbft_lock:
        pbft_sequence_number += 1
        sequence_number = pbft_sequence_number
    
    body = {
        'transactions': transactions,
        'previous_hash': previous_hash,
        'timestamp': time.time(),
        'sequence_number': sequence_number,
        'view_number': pbft_view_number
    }
    
    header = {
        'generator_id': miner_id,
        'hash': encryption_module.hashing_function(body),
        'blockNo': blockNo,
        'pre_prepare_sigs': {},
        'prepare_sigs': {},
        'commit_sigs': {}
    }
    
    block = {
        'Header': header,
        'Body': body
    }
    
    return block

def pbft_pre_prepare(block, miner_list, primary_id):
    """Primary node sends pre-prepare message to all replicas"""
    if block['Header']['generator_id'] != primary_id:
        return False
    
    # In a real implementation, primary would sign the block here
    signature = encryption_module.hashing_function(str(block['Body']['sequence_number']) + 
                                                 str(block['Body']['view_number']) + 
                                                 block['Header']['hash'])
    
    block['Header']['pre_prepare_sigs'][primary_id] = signature
    return True

def pbft_prepare(block, miner_id, miner_list):
    """Replica sends prepare message to all other replicas"""
    global pbft_prepared
    
    seq_num = block['Body']['sequence_number']
    view_num = block['Body']['view_number']
    
    # Generate signature for prepare message
    signature = encryption_module.hashing_function(str(seq_num) + 
                                                 str(view_num) + 
                                                 block['Header']['hash'] + 
                                                 str(miner_id))
    
    # Add signature to prepare signatures
    with pbft_lock:
        block['Header']['prepare_sigs'][miner_id] = signature
        pbft_prepared[seq_num].add(miner_id)
    
    # Check if we have 2f+1 prepare messages (f is the max number of faulty nodes)
    f = (len(miner_list) - 1) // 3  # Maximum number of Byzantine nodes
    return len(pbft_prepared[seq_num]) >= 2*f + 1

def pbft_commit(block, miner_id, miner_list):
    """Replica sends commit message to all other replicas"""
    global pbft_committed
    
    seq_num = block['Body']['sequence_number']
    view_num = block['Body']['view_number']
    
    # Generate signature for commit message
    signature = encryption_module.hashing_function(str(seq_num) + 
                                                 str(view_num) + 
                                                 block['Header']['hash'] + 
                                                 str(miner_id) + 
                                                 "commit")
    
    # Add signature to commit signatures
    with pbft_lock:
        block['Header']['commit_sigs'][miner_id] = signature
        pbft_committed[seq_num].add(miner_id)
    
    # Check if we have 2f+1 commit messages
    f = (len(miner_list) - 1) // 3  # Maximum number of Byzantine nodes
    return len(pbft_committed[seq_num]) >= 2*f + 1

def pbft_block_is_valid(block, miner_list):
    """Validate a PBFT block"""
    # Check basic block integrity
    if block['Header']['hash'] != encryption_module.hashing_function(block['Body']):
        return False
    
    # Check that we have enough pre-prepare, prepare and commit signatures
    f = (len(miner_list) - 1) // 3  # Maximum number of Byzantine nodes
    min_signatures = 2*f + 1
    
    if len(block['Header']['pre_prepare_sigs']) < 1:  # Need at least primary's signature
        return False
    
    if len(block['Header']['prepare_sigs']) < min_signatures:
        return False
    
    if len(block['Header']['commit_sigs']) < min_signatures:
        return False
    
    # In a real implementation, we would also verify all signatures here
    
    return True

def trigger_pbft_miners(the_miners_list, expected_chain_length, numOfTXperBlock, blockchainFunction):
    """Trigger PBFT consensus process"""
    # Determine primary node (typically node 0 in view 0)
    primary_id = the_miners_list[pbft_view_number % len(the_miners_list)].address
    
    for counter in range(expected_chain_length):
        # Step 1: Primary creates a block and sends pre-prepare
        primary = None
        for miner in the_miners_list:
            if miner.address == primary_id:
                primary = miner
                break
        
        if not primary or not primary.local_mempool:
            # View change would happen here in a real implementation if primary fails
            output.mempool_is_empty()
            break
        
        # Get transactions from the mempool
        transactions = accumulate_transactions(numOfTXperBlock, primary.local_mempool, 
                                              blockchainFunction, primary.address)
        
        # Find previous hash
        previous_hash = ""
        if primary.blockchain:
            previous_hash = primary.blockchain[-1]['Header']['hash']
        
        # Create new block
        block = pbft_generate_block(primary.address, transactions, previous_hash, len(primary.blockchain))
        
        # Step 2: Pre-prepare phase
        if not pbft_pre_prepare(block, the_miners_list, primary_id):
            # Handle pre-prepare failure
            continue
        
        # Broadcast to all nodes
        for miner in the_miners_list:
            miner.new_block_received = copy.deepcopy(block)
        
        # Step 3: Prepare phase
        prepare_success = True
        for miner in the_miners_list:
            if not pbft_prepare(miner.new_block_received, miner.address, the_miners_list):
                prepare_success = False
                break
        
        if not prepare_success:
            # Could trigger view change here
            continue
        
        # Step 4: Commit phase
        commit_success = True
        for miner in the_miners_list:
            if not pbft_commit(miner.new_block_received, miner.address, the_miners_list):
                commit_success = False
                break
        
        if not commit_success:
            # Could trigger view change here
            continue
        
        # Step 5: All nodes add the block to their blockchain
        for miner in the_miners_list:
            if pbft_block_is_valid(miner.new_block_received, the_miners_list):
                miner.blockchain.append(copy.deepcopy(miner.new_block_received))
                # Remove processed transactions from local mempool
                for tx in transactions:
                    if tx in miner.local_mempool:
                        miner.local_mempool.remove(tx)
        
        output.simulation_progress(counter, expected_chain_length)

# Update block_is_valid function to include PBFT validation
def block_is_valid(type_of_consensus, new_block, top_block, next_pos_block_from, miner_list, delegates):
    if type_of_consensus == 1:
        return pow_block_is_valid(new_block, top_block['Header']['hash'])
    if type_of_consensus == 2:
        return pos_block_is_valid(new_block['Header']['generator_id'], next_pos_block_from, new_block, top_block['Header']['hash'])
    if type_of_consensus == 3:
        return poa_block_is_valid(new_block, top_block['Header']['hash'], miner_list)
    if type_of_consensus == 4:
        return poet_block_is_valid(top_block, new_block)
    if type_of_consensus == 5:
        return dpos_block_is_valid(new_block, delegates, top_block['Header']['hash'])
    if type_of_consensus == 6:
        return pbft_block_is_valid(new_block, miner_list)

# Update the miners_trigger function to include the PBFT trigger
def miners_trigger(the_miners_list, the_type_of_consensus, expected_chain_length, Parallel_PoW_mining, numOfTXperBlock, blockchainFunction, poet_block_time, Asymmetric_key_length, number_of_DPoS_delegates, AI_assisted_mining_wanted):
    output.mempool_info(mempool.MemPool)
    for obj in the_miners_list:
        obj.local_mempool = copy.deepcopy(mempool.MemPool)
    if the_type_of_consensus == 1:
        trigger_pow_miners(the_miners_list, the_type_of_consensus, expected_chain_length, Parallel_PoW_mining, numOfTXperBlock, blockchainFunction, AI_assisted_mining_wanted)
    if the_type_of_consensus == 2:
        trigger_pos_miners(the_miners_list, the_type_of_consensus, expected_chain_length, numOfTXperBlock, blockchainFunction)
    if the_type_of_consensus == 3:
        trigger_poa_miners(the_miners_list, the_type_of_consensus, expected_chain_length, numOfTXperBlock, blockchainFunction)
    if the_type_of_consensus == 4:
        trigger_poet_miners(expected_chain_length, the_miners_list, poet_block_time, numOfTXperBlock, the_type_of_consensus, blockchainFunction, Asymmetric_key_length, Parallel_PoW_mining)
    if the_type_of_consensus == 5:
        trigger_dpos_miners(expected_chain_length, the_miners_list, number_of_DPoS_delegates, numOfTXperBlock, the_type_of_consensus, blockchainFunction, Parallel_PoW_mining)
    if the_type_of_consensus == 6:
        trigger_pbft_miners(the_miners_list, expected_chain_length, numOfTXperBlock, blockchainFunction)

# Update generate_new_block function to handle PBFT blocks correctly
def generate_new_block(transactions, generator_id, previous_hash, type_of_consensus, AI_assisted_mining_wanted, is_adversary):
    new_block = {'Header': {'generator_id': generator_id,
                            'hash': '',
                            'blockNo': 0},
                 'Body': {'transactions': transactions,
                          'nonce': 0,
                          'previous_hash': previous_hash,
                          'timestamp': time.time()}}
    if type_of_consensus == 1:
        if AI_assisted_mining_wanted:
            new_block['Header']['is_adversary'] = is_adversary
        new_block = pow_mining(new_block, AI_assisted_mining_wanted, is_adversary)
    else:
        new_block['Header']['hash'] = encryption_module.hashing_function(new_block['Body'])
    if type_of_consensus == 4:
        new_block['Header']['PoET'] = ''
    if type_of_consensus == 5:
        new_block['Header']['dummy_new_proof'] = dummy_proof_generator_function(new_block)
        return new_block
    elif type_of_consensus == 6:  # PBFT
        new_block = pbft_generate_block(generator_id, transactions, previous_hash, 0)
        return new_block
    return new_block

