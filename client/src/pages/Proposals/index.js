// client/src/pages/Proposals/index.js
import React from 'react';
import ProposalList from '../../components/Proposals/ProposalList';
import { motion } from 'framer-motion';

const ProposalsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <motion.div 
          className="absolute top-20 left-1/4 w-48 h-48 bg-blue-200 opacity-10 rounded-full"
          animate={{
            x: [0, 40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-60 right-1/4 w-36 h-36 bg-indigo-200 opacity-10 rounded-full"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-40 left-1/3 w-24 h-24 bg-purple-200 opacity-10 rounded-full"
          animate={{
            x: [0, 30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Geometric shapes */}
        <motion.div 
          className="absolute top-1/4 right-20 w-16 h-16 bg-blue-200 opacity-10 rotate-45"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 left-20 w-12 h-12 bg-indigo-200 opacity-10 rotate-12"
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header with animation */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Daftar Proposal</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Telusuri daftar proposal penelitian dan pengabdian yang telah diajukan.
          </p>
        </motion.div>

       

        {/* Proposal List Container */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-sm bg-opacity-80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ProposalList />
        </motion.div>

        
      </div>
    </div>
  );
};

export default ProposalsPage;