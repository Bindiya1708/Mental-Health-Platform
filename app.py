from flask import Flask, request, jsonify
from flask_cors import CORS 
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.ensemble import RandomForestClassifier

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return render_template('index.html')

# Load and preprocess the data
anxiety_dataset = pd.read_csv('Dataset/anxiety_dataset.csv')
depression_dataset = pd.read_csv("Dataset/depression_data.csv.gz", compression="gzip", usecols=["column1", "column2"])

# Add Target column
anxiety_dataset['Target'] = 2  # Anxiety
depression_dataset['Target'] = 1  # Depression

# Rename anxiety columns to match the depression dataset
anxiety_dataset.rename(columns={
    'gender': 'Gender',
    'afftype': 'Afftype',
    'melanch': 'Melancholy',
    'edu': 'Education Level',
    'marriage': 'Marital Status',
    'work': 'Employment Status',
    'madrs1': 'Madrs1',
    'madrs2': 'Madrs2',
}, inplace=True)

# Create a combined dataset
combined_dataset = pd.concat([depression_dataset, anxiety_dataset], ignore_index=True)

# Define columns
categorical_cols = [
    'Marital Status', 'Education Level', 'Smoking Status', 'Physical Activity Level',
    'Employment Status', 'Alcohol Consumption', 'Dietary Habits', 'Sleep Patterns', 
    'History of Mental Illness', 'History of Substance Abuse', 'Family History of Depression', 
    'Chronic Medical Conditions', 'Afftype', 'Gender'
]
numerical_cols = ['Age', 'Number of Children', 'Income', 'Madrs1', 'Madrs2']

# Fill missing values
combined_dataset[categorical_cols] = combined_dataset[categorical_cols].fillna('Unknown').astype(str)
combined_dataset[numerical_cols] = combined_dataset[numerical_cols].fillna(0).astype(float)

# Define transformers and model pipeline
column_transformer = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_cols),
        ('cat', OneHotEncoder(drop='first', handle_unknown='ignore'), categorical_cols)
    ]
)

# Prepare features and target variable
X = combined_dataset.drop(columns=['Target'])
y = combined_dataset['Target']

# Transform features
X_transformed = column_transformer.fit_transform(X)

# Feature selection
selector = SelectKBest(f_classif, k=10)
X_selected = selector.fit_transform(X_transformed, y)

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X_selected, y, test_size=0.2, random_state=42)

# Train the classifier
classifier = RandomForestClassifier(random_state=42)
classifier.fit(X_train, y_train)

# Prediction function
def predict_mental_health(user_data):
    # Fill missing data with defaults
    for col in categorical_cols:
        if col not in user_data:
            user_data[col] = 'Unknown'
    for col in numerical_cols:
        if col not in user_data:
            user_data[col] = 0.0

    user_df = pd.DataFrame([user_data])
    user_df_transformed = column_transformer.transform(user_df)
    user_df_selected = selector.transform(user_df_transformed)
    prediction = classifier.predict(user_df_selected)
    
    return "Depression" if prediction[0] == 1 else "Anxiety" if prediction[0] == 2 else "No mental health issues"

# API endpoint
@app.route('/predict', methods=['POST'])
def predict():
    try:
        user_data = request.json
        prediction = predict_mental_health(user_data)
        return jsonify({'prediction': prediction})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))  # Default to 10000 if PORT is not set
    app.run(host="0.0.0.0", port=port, debug=False)
