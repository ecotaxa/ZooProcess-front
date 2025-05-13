import fs from 'fs';
import path from 'path';

// Number of days to keep files
const DAYS_TO_KEEP = 7;

// Path to the uploads directory
const uploadsDir = path.join(process.env.NEXT_PUBLIC_REAL_FOLDER || '', 'uploads');

// Get current date
const now = new Date();

// Function to delete old folders
function cleanupOldFolders() {
    try {
        // Read all folders in the uploads directory
        const folders = fs.readdirSync(uploadsDir);
        
        folders.forEach(folder => {
            // Check if the folder name matches our date format (YYYY-MM-DD)
            if (/^\d{4}-\d{2}-\d{2}$/.test(folder)) {
                const folderPath = path.join(uploadsDir, folder);
                
                // Parse the date from the folder name
                const [year, month, day] = folder.split('-').map(Number);
                const folderDate = new Date(year, month - 1, day);
                
                // Calculate the difference in days
                const diffTime = now.getTime() - folderDate.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                
                // If the folder is older than DAYS_TO_KEEP, delete it
                if (diffDays > DAYS_TO_KEEP) {
                    console.log(`Deleting old folder: ${folderPath}`);
                    fs.rmSync(folderPath, { recursive: true, force: true });
                }
            }
        });
        
        console.log('Cleanup completed successfully');
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
}

// Run the cleanup
cleanupOldFolders();
