from dataset_cleaning import clean_dataset
from synthetic_data import generate_synthetic_data
from clustering import perform_clustering
from quantile_pseudo_labelling import pseudo_label_data
from oversampling import oversample_data
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

def main():
    logging.info("Starting the pipeline...")

    try:
        # Step 1: Dataset Cleaning
        logging.info("Step 1: Cleaning the dataset...")
        clean_dataset()
        logging.info("Dataset cleaning completed successfully.")

        # Step 2: Generate Synthetic Data
        logging.info("Step 2: Generating synthetic data...")
        generate_synthetic_data()
        logging.info("Synthetic data generation completed successfully.")

        # Step 3: Perform Clustering
        logging.info("Step 3: Performing clustering...")
        perform_clustering()
        logging.info("Clustering completed successfully.")

        # Step 4: Quantile Pseudo-Labelling
        logging.info("Step 4: Applying quantile pseudo-labelling...")
        pseudo_label_data()
        logging.info("Quantile pseudo-labelling completed successfully.")

        # Step 5: Oversampling
        logging.info("Step 5: Performing oversampling...")
        oversample_data()
        logging.info("Oversampling completed successfully.")

        logging.info("Pipeline execution completed successfully!")

    except Exception as e:
        logging.error(f"An error occurred during pipeline execution: {e}")

if __name__ == "__main__":
    main()