import { motion } from 'framer-motion';
import { FaPrint, FaDownload } from 'react-icons/fa';

const Receipt = ({ receiptData, onClose }) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(receiptData.receipt_html);
    printWindow.document.close();
    printWindow.print();
  };

  if (!receiptData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Receipt</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="p-2 text-gray-500 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
              >
                <FaPrint />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: receiptData.receipt_html }}
          />

          <button
            onClick={onClose}
            className="btn-primary w-full mt-4"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Receipt;