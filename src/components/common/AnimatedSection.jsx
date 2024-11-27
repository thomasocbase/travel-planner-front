import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedSection(props) {
    return (
        <motion.section
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ amount: 0.5 }}
            transition={{ duration: 0.5 }}
        >
            {props.children}
        </motion.section>
    )
}