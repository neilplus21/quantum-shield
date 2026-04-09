# Add this method to your Miner class in miner.py

def build_block(self, numOfTXperBlock, the_miners_list, type_of_consensus, blockchain_function, expected_chain_length, AI_assisted_mining_wanted):
    # ... existing code ...
    
    # Add this case for PBFT in the existing build_block method
    if type_of_consensus == 6:  # PBFT
        # PBFT nodes typically wait for the primary node to initiate the process
        # The primary initiates in trigger_pbft_miners function
        primary_id = the_miners_list[consensus.pbft_view_number % len(the_miners_list)].address
        
        # Only primary creates blocks
        if self.address == primary_id:
            if self.local_mempool:
                transactions = consensus.accumulate_transactions(numOfTXperBlock, self.local_mempool, 
                                                              blockchain_function, self.address)
                
                previous_hash = ""
                if self.blockchain:
                    previous_hash = self.blockchain[-1]['Header']['hash']
                    blockNo = len(self.blockchain)
                else:
                    blockNo = 0
                
                new_block = consensus.pbft_generate_block(self.address, transactions, previous_hash, blockNo)
                
                # Pre-prepare phase is handled in trigger_pbft_miners
                self.new_block_received = copy.deepcopy(new_block)

