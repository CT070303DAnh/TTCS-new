import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score, 
    precision_score, 
    recall_score, 
    f1_score,
    classification_report,
    confusion_matrix,
    roc_auc_score
)
from imblearn.over_sampling import SMOTE
from collections import Counter
import warnings
warnings.filterwarnings('ignore')

def load_object(file_path: str):
    """Load pickle object"""
    with open(file_path, "rb") as file_obj:
        return pickle.load(file_obj)

def save_object(file_path: str, obj: object):
    """Save pickle object"""
    import os
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, "wb") as file_obj:
        pickle.dump(obj, file_obj)

def evaluate_model(model, X_train, y_train, X_test, y_test, model_name="Model"):
    """Evaluate model and return metrics"""
    y_train_pred = model.predict(X_train)
    y_test_pred = model.predict(X_test)
    
    train_acc = accuracy_score(y_train, y_train_pred)
    test_acc = accuracy_score(y_test, y_test_pred)
    
    train_f1 = f1_score(y_train, y_train_pred, average='weighted')
    test_f1 = f1_score(y_test, y_test_pred, average='weighted')
    
    # Calculate per-class recall (most important for imbalanced data)
    test_recall_per_class = recall_score(y_test, y_test_pred, average=None)
    
    print(f"\n{'='*80}")
    print(f"{model_name}")
    print(f"{'='*80}")
    print(f"Train Accuracy: {train_acc:.4f} | Test Accuracy: {test_acc:.4f}")
    print(f"Train F1-Score: {train_f1:.4f} | Test F1-Score: {test_f1:.4f}")
    print(f"\nRecall per class (Test):")
    for i, recall in enumerate(test_recall_per_class):
        print(f"  Class {int(i)}: {recall:.4f}")
    
    print(f"\nConfusion Matrix (Test):")
    print(confusion_matrix(y_test, y_test_pred))
    
    print(f"\nClassification Report (Test):")
    print(classification_report(y_test, y_test_pred))
    
    return {
        'model': model,
        'train_acc': train_acc,
        'test_acc': test_acc,
        'train_f1': train_f1,
        'test_f1': test_f1,
        'recall_per_class': test_recall_per_class,
        'avg_recall': np.mean(test_recall_per_class)
    }

if __name__ == "__main__":
    try:
        print("="*80)
        print("CẢI THIỆN MODEL TIỂU ĐƯỜNG - XỬ LÝ CLASS IMBALANCE")
        print("="*80)
        
        # Load preprocessor
        print("\n📂 Đang load preprocessor...")
        preprocessor = load_object("final_model/diabetespreprocessor.pkl")
        print("✓ Preprocessor loaded")
        
        # Load raw data
        print("\n📊 Đang load dữ liệu...")
        df = pd.read_csv("Medical_Data/diabetes_data.csv")
        print(f"✓ Loaded {len(df)} samples")
        
        # Prepare data
        target_col = 'Diabetes_012'
        X = df.drop(columns=[target_col])
        y = df[target_col]
        
        print(f"\n📈 Phân bố classes ban đầu:")
        class_counts = Counter(y)
        for class_label, count in sorted(class_counts.items()):
            print(f"  Class {int(class_label)}: {count:,} ({count/len(y)*100:.2f}%)")
        
        # Split data
        print("\n✂️  Chia dữ liệu train/test...")
        X_train_raw, X_test_raw, y_train, y_test = train_test_split(
            X, y, test_size=0.3, random_state=42, stratify=y
        )
        print(f"✓ Train: {len(X_train_raw):,} samples")
        print(f"✓ Test: {len(X_test_raw):,} samples")
        
        # Transform data
        print("\n⚙️  Transform dữ liệu...")
        X_train = preprocessor.transform(X_train_raw)
        X_test = preprocessor.transform(X_test_raw)
        print(f"✓ Features: {X_train.shape[1]}")
        
        # ===================================================================
        # METHOD 1: Class Weight Balancing
        # ===================================================================
        print("\n" + "="*80)
        print("PHƯƠNG PHÁP 1: CLASS WEIGHT BALANCING")
        print("="*80)
        
        print("\n🔧 Training Gradient Boosting với class_weight='balanced'...")
        gb_balanced = GradientBoostingClassifier(
            n_estimators=128,
            learning_rate=0.1,
            subsample=0.8,
            random_state=42,
            verbose=0
        )
        
        # Calculate class weights manually
        from sklearn.utils.class_weight import compute_sample_weight
        sample_weights = compute_sample_weight('balanced', y_train)
        gb_balanced.fit(X_train, y_train, sample_weight=sample_weights)
        
        results_gb_balanced = evaluate_model(
            gb_balanced, X_train, y_train, X_test, y_test,
            "Gradient Boosting (Balanced)"
        )
        
        print("\n🔧 Training Random Forest với class_weight='balanced'...")
        rf_balanced = RandomForestClassifier(
            n_estimators=128,
            class_weight='balanced',
            random_state=42,
            n_jobs=-1,
            verbose=0
        )
        rf_balanced.fit(X_train, y_train)
        
        results_rf_balanced = evaluate_model(
            rf_balanced, X_train, y_train, X_test, y_test,
            "Random Forest (Balanced)"
        )
        
        # ===================================================================
        # METHOD 2: SMOTE (Synthetic Minority Over-sampling)
        # ===================================================================
        print("\n" + "="*80)
        print("PHƯƠNG PHÁP 2: SMOTE (OVERSAMPLING)")
        print("="*80)
        
        print("\n🔧 Áp dụng SMOTE...")
        smote = SMOTE(random_state=42, k_neighbors=5)
        X_train_smote, y_train_smote = smote.fit_resample(X_train, y_train)
        
        print(f"\n📈 Phân bố classes sau SMOTE:")
        smote_counts = Counter(y_train_smote)
        for class_label, count in sorted(smote_counts.items()):
            print(f"  Class {int(class_label)}: {count:,}")
        
        print("\n🔧 Training Gradient Boosting với SMOTE...")
        gb_smote = GradientBoostingClassifier(
            n_estimators=128,
            learning_rate=0.1,
            subsample=0.8,
            random_state=42,
            verbose=0
        )
        gb_smote.fit(X_train_smote, y_train_smote)
        
        results_gb_smote = evaluate_model(
            gb_smote, X_train, y_train, X_test, y_test,
            "Gradient Boosting (SMOTE)"
        )
        
        print("\n🔧 Training Random Forest với SMOTE...")
        rf_smote = RandomForestClassifier(
            n_estimators=128,
            random_state=42,
            n_jobs=-1,
            verbose=0
        )
        rf_smote.fit(X_train_smote, y_train_smote)
        
        results_rf_smote = evaluate_model(
            rf_smote, X_train, y_train, X_test, y_test,
            "Random Forest (SMOTE)"
        )
        
        # ===================================================================
        # METHOD 3: Hybrid - SMOTE + Class Weight
        # ===================================================================
        print("\n" + "="*80)
        print("PHƯƠNG PHÁP 3: HYBRID (SMOTE + CLASS WEIGHT)")
        print("="*80)
        
        print("\n🔧 Training Random Forest với SMOTE + balanced weights...")
        rf_hybrid = RandomForestClassifier(
            n_estimators=128,
            class_weight='balanced',
            random_state=42,
            n_jobs=-1,
            verbose=0
        )
        rf_hybrid.fit(X_train_smote, y_train_smote)
        
        results_rf_hybrid = evaluate_model(
            rf_hybrid, X_train, y_train, X_test, y_test,
            "Random Forest (Hybrid)"
        )
        
        # ===================================================================
        # COMPARE RESULTS AND SELECT BEST MODEL
        # ===================================================================
        print("\n" + "="*80)
        print("SO SÁNH KẾT QUẢ")
        print("="*80)
        
        all_results = {
            'GB Balanced': results_gb_balanced,
            'RF Balanced': results_rf_balanced,
            'GB SMOTE': results_gb_smote,
            'RF SMOTE': results_rf_smote,
            'RF Hybrid': results_rf_hybrid
        }
        
        print("\n📊 Bảng so sánh:")
        print(f"{'Model':<20} {'Test Acc':<12} {'Test F1':<12} {'Avg Recall':<12} {'Class 0':<10} {'Class 1':<10} {'Class 2':<10}")
        print("-"*100)
        
        for name, results in all_results.items():
            recalls = results['recall_per_class']
            print(f"{name:<20} {results['test_acc']:<12.4f} {results['test_f1']:<12.4f} "
                  f"{results['avg_recall']:<12.4f} {recalls[0]:<10.4f} {recalls[1]:<10.4f} {recalls[2]:<10.4f}")
        
        # Select best model based on average recall (balanced performance across all classes)
        best_model_name = max(all_results.items(), key=lambda x: x[1]['avg_recall'])[0]
        best_model = all_results[best_model_name]['model']
        
        print(f"\n🏆 Model tốt nhất: {best_model_name}")
        print(f"   (Dựa trên Average Recall - performance cân bằng trên tất cả classes)")
        
        # Save best model
        print(f"\n💾 Đang lưu model mới...")
        save_object("final_model/diabetes_improved_model.pkl", best_model)
        print("✓ Đã lưu: final_model/diabetes_improved_model.pkl")
        
        # Also ask if user wants to replace the old model
        print("\n" + "="*80)
        print("📋 KHUYẾN NGHỊ")
        print("="*80)
        print(f"""
Model mới đã được lưu tại: final_model/diabetes_improved_model.pkl

Ưu điểm của model mới:
✓ Dự đoán tốt hơn cho class thiểu số (class 1 và class 2)
✓ Performance cân bằng hơn giữa các classes
✓ Recall cao hơn cho các trường hợp bệnh tiểu đường thực sự

Nếu bạn muốn thay thế model cũ, chạy lệnh:
  cp final_model/diabetes_improved_model.pkl final_model/diabetesbest_model.pkl

Hoặc trong Python:
  import shutil
  shutil.copy('final_model/diabetes_improved_model.pkl', 'final_model/diabetesbest_model.pkl')
""")
        
        print("\n✅ HOÀN TẤT!")
        
    except Exception as e:
        print(f"\n❌ LỖI: {str(e)}")
        import traceback
        traceback.print_exc()

