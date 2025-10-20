"""
Data preprocessing pipeline for projects and publications.
Reads CSV files, cleans data, resolves relationships, and outputs JSON.
"""

import pandas as pd
import numpy as np
import json
from pathlib import Path

# Get project root directory
root = Path(__file__).resolve().parents[1]

# Load CSV files
projects = pd.read_csv(root / "sample_projects.csv")
publications = pd.read_csv(root / "sample_publications.csv")
links = pd.read_csv(root / "publicationprojectlink.csv")

# Merge publications with projects via link table
pubs_by_project = links.merge(
    publications, 
    left_on="publication_uuid", 
    right_on="uuid", 
    how="left"
)

# Convert NaN values to None (null in JSON) for valid JSON output
output = {
    "projects": projects.replace({np.nan: None}).to_dict(orient="records"),
    "publications": publications.replace({np.nan: None}).to_dict(orient="records"),
    "links": links.replace({np.nan: None}).to_dict(orient="records"),
}

# Write processed data to JSON file
output_path = Path(root / "backend" / "data.json")
output_path.write_text(
    json.dumps(output, ensure_ascii=False, indent=2), 
    encoding="utf-8"
)

print(f"✓ Data processing complete. Output: {output_path}")
print(f"  - {len(output['projects'])} projects")
print(f"  - {len(output['publications'])} publications")
print(f"  - {len(output['links'])} links")

