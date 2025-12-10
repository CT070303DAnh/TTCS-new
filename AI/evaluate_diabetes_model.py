import pickle
import numpy as np
from sklearn.metrics import (
    accuracy_score, 
    precision_score, 
    recall_score, 
    f1_score,
    classification_report,
    confusion_matrix,
    roc_auc_score
)
import warnings
warnings.filterwarnings('ignore')

def load_object(file_path: str):
    """Load pickle object"""
    with open(file_path, "rb") as file_obj:
        return pickle.load(file_obj)

def load_numpy_array_data(file_path: str):
    """Load numpy array data"""
    with open(file_path, "rb") as file_obj:
        return np.load(file_obj)

def evaluate_model_performance(model, X_train, y_train, X_test, y_test):
    """Evaluate model on both train and test sets to detect overfitting"""
    
    # Predictions
    y_train_pred = model.predict(X_train)
    y_test_pred = model.predict(X_test)
    
    # Calculate metrics for training set
    train_accuracy = accuracy_score(y_train, y_train_pred)
    train_precision = precision_score(y_train, y_train_pred, average='weighted', zero_division=0)
    train_recall = recall_score(y_train, y_train_pred, average='weighted', zero_division=0)
    train_f1 = f1_score(y_train, y_train_pred, average='weighted', zero_division=0)
    
    # Calculate metrics for test set
    test_accuracy = accuracy_score(y_test, y_test_pred)
    test_precision = precision_score(y_test, y_test_pred, average='weighted', zero_division=0)
    test_recall = recall_score(y_test, y_test_pred, average='weighted', zero_division=0)
    test_f1 = f1_score(y_test, y_test_pred, average='weighted', zero_division=0)
    
    # Try to get probability predictions for ROC-AUC
    try:
        if hasattr(model, 'predict_proba'):
            y_train_proba = model.predict_proba(X_train)
            y_test_proba = model.predict_proba(X_test)
            
            # For binary classification
            if y_train_proba.shape[1] == 2:
                train_roc_auc = roc_auc_score(y_train, y_train_proba[:, 1])
                test_roc_auc = roc_auc_score(y_test, y_test_proba[:, 1])
            else:
                # For multiclass
                train_roc_auc = roc_auc_score(y_train, y_train_proba, multi_class='ovr', average='weighted')
                test_roc_auc = roc_auc_score(y_test, y_test_proba, multi_class='ovr', average='weighted')
        else:
            train_roc_auc = None
            test_roc_auc = None
    except:
        train_roc_auc = None
        test_roc_auc = None
    
    return {
        'train': {
            'accuracy': train_accuracy,
            'precision': train_precision,
            'recall': train_recall,
            'f1_score': train_f1,
            'roc_auc': train_roc_auc
        },
        'test': {
            'accuracy': test_accuracy,
            'precision': test_precision,
            'recall': test_recall,
            'f1_score': test_f1,
            'roc_auc': test_roc_auc
        },
        'confusion_matrix_test': confusion_matrix(y_test, y_test_pred),
        'classification_report_test': classification_report(y_test, y_test_pred)
    }

def check_overfitting(metrics, threshold=0.10):
    """
    Check if model is overfitting
    threshold: acceptable difference between train and test performance (default 10%)
    """
    print("\n" + "="*80)
    print("PHÂN TÍCH OVERFITTING")
    print("="*80)
    
    overfitting_detected = False
    warnings = []
    
    for metric_name in ['accuracy', 'precision', 'recall', 'f1_score', 'roc_auc']:
        train_score = metrics['train'][metric_name]
        test_score = metrics['test'][metric_name]
        
        if train_score is not None and test_score is not None:
            diff = train_score - test_score
            diff_percent = (diff / train_score) * 100
            
            print(f"\n{metric_name.upper()}:")
            print(f"  Train: {train_score:.4f}")
            print(f"  Test:  {test_score:.4f}")
            print(f"  Chênh lệch: {diff:.4f} ({diff_percent:.2f}%)")
            
            if diff > threshold:
                overfitting_detected = True
                print(f"  ⚠️  CẢNH BÁO: Chênh lệch > {threshold*100}% - có dấu hiệu overfitting!")
                warnings.append(f"{metric_name}: chênh lệch {diff_percent:.2f}%")
            else:
                print(f"  ✓  OK: Chênh lệch trong ngưỡng chấp nhận được")
    
    print("\n" + "="*80)
    if overfitting_detected:
        print("❌ KẾT LUẬN: Model có DẤU HIỆU OVERFITTING!")
        print("\nCác vấn đề phát hiện:")
        for w in warnings:
            print(f"  - {w}")
        print("\n📋 KHUYẾN NGHỊ:")
        print("  1. Tăng regularization (C nhỏ hơn cho Logistic Regression)")
        print("  2. Giảm độ phức tạp model (max_depth, n_estimators)")
        print("  3. Thu thập thêm dữ liệu training")
        print("  4. Sử dụng cross-validation kỹ hơn")
        print("  5. Feature selection/engineering")
    else:
        print("✅ KẾT LUẬN: Model KHÔNG bị overfitting nghiêm trọng")
        print("   Performance trên train và test set tương đối đồng đều")
    print("="*80)

if __name__ == "__main__":
    try:
        print("="*80)
        print("ĐÁNH GIÁ MODEL DỰ ĐOÁN BỆNH TIỂU ĐƯỜNG")
        print("="*80)
        
        # Load model and preprocessor
        print("\n📂 Đang load model và preprocessor...")
        model = load_object("final_model/diabetesbest_model.pkl")
        preprocessor = load_object("final_model/diabetespreprocessor.pkl")
        print(f"✓ Model type: {type(model).__name__}")
        print(f"✓ Preprocessor loaded")
        
        # Try to load transformed data first
        print("\n📊 Đang load dữ liệu train và test...")
        try:
            train_arr = load_numpy_array_data("Transform_Store/train.npy")
            test_arr = load_numpy_array_data("Transform_Store/test.npy")
            
            # Split features and target
            X_train = train_arr[:, :-1]
            y_train = train_arr[:, -1]
            X_test = test_arr[:, :-1]
            y_test = test_arr[:, -1]
            
            print(f"✓ Train set: {X_train.shape[0]} samples, {X_train.shape[1]} features")
            print(f"✓ Test set: {X_test.shape[0]} samples, {X_test.shape[1]} features")
            
            # Check if features match model requirements
            # Try prediction on small sample to verify
            try:
                _ = model.predict(X_train[:1])
                print("✓ Dữ liệu transform phù hợp với model")
            except ValueError as ve:
                print(f"⚠️  Dữ liệu transform không khớp với model: {ve}")
                print("   Cần transform lại dữ liệu từ raw data...")
                
                # Load raw data and transform
                import pandas as pd
                from sklearn.model_selection import train_test_split
                
                print("\n📂 Đang load raw data...")
                df = pd.read_csv("Medical_Data/diabetes_data.csv")
                print(f"✓ Loaded {len(df)} samples")
                
                # Assuming target column is Diabetes_012 (first column)
                # Check common diabetes target names
                target_col = None
                for col in ['Diabetes_012', 'diabetes', 'Diabetes', 'outcome', 'Outcome', 'target']:
                    if col in df.columns:
                        target_col = col
                        break
                
                if target_col is None:
                    # Assume first column is target
                    target_col = df.columns[0]
                    print(f"⚠️  Không tìm thấy cột target thông thường, sử dụng cột đầu: {target_col}")
                else:
                    print(f"✓ Target column: {target_col}")
                
                # Split data
                X = df.drop(columns=[target_col])
                y = df[target_col]
                
                # Use same split as original (assuming 70-30 split)
                X_train_raw, X_test_raw, y_train, y_test = train_test_split(
                    X, y, test_size=0.3, random_state=42
                )
                
                print(f"✓ Split: {len(X_train_raw)} train, {len(X_test_raw)} test")
                
                # Transform using preprocessor
                print("⚙️  Đang transform dữ liệu...")
                X_train = preprocessor.transform(X_train_raw)
                X_test = preprocessor.transform(X_test_raw)
                
                print(f"✓ Transformed train: {X_train.shape[0]} samples, {X_train.shape[1]} features")
                print(f"✓ Transformed test: {X_test.shape[0]} samples, {X_test.shape[1]} features")
                
        except FileNotFoundError:
            print("⚠️  Không tìm thấy Transform_Store data, loading raw data...")
            # Load raw data
            import pandas as pd
            from sklearn.model_selection import train_test_split
            
            df = pd.read_csv("Medical_Data/diabetes_data.csv")
            print(f"✓ Loaded {len(df)} samples")
            
            # Find target column
            target_col = None
            for col in ['Diabetes_012', 'diabetes', 'Diabetes', 'outcome', 'Outcome', 'target']:
                if col in df.columns:
                    target_col = col
                    break
            if target_col is None:
                target_col = df.columns[0]
            
            print(f"✓ Target column: {target_col}")
            
            X = df.drop(columns=[target_col])
            y = df[target_col]
            
            X_train_raw, X_test_raw, y_train, y_test = train_test_split(
                X, y, test_size=0.3, random_state=42
            )
            
            X_train = preprocessor.transform(X_train_raw)
            X_test = preprocessor.transform(X_test_raw)
            
            print(f"✓ Transformed: {X_train.shape[1]} features")
        
        print(f"✓ Classes: {np.unique(y_train)}")
        
        # Evaluate model
        print("\n⚙️  Đang đánh giá model...")
        metrics = evaluate_model_performance(model, X_train, y_train, X_test, y_test)
        
        # Print detailed results
        print("\n" + "="*80)
        print("KẾT QUẢ ĐÁNH GIÁ CHI TIẾT")
        print("="*80)
        
        print("\n📈 TRAINING SET:")
        print(f"  Accuracy:  {metrics['train']['accuracy']:.4f}")
        print(f"  Precision: {metrics['train']['precision']:.4f}")
        print(f"  Recall:    {metrics['train']['recall']:.4f}")
        print(f"  F1-Score:  {metrics['train']['f1_score']:.4f}")
        if metrics['train']['roc_auc']:
            print(f"  ROC-AUC:   {metrics['train']['roc_auc']:.4f}")
        
        print("\n📉 TEST SET:")
        print(f"  Accuracy:  {metrics['test']['accuracy']:.4f}")
        print(f"  Precision: {metrics['test']['precision']:.4f}")
        print(f"  Recall:    {metrics['test']['recall']:.4f}")
        print(f"  F1-Score:  {metrics['test']['f1_score']:.4f}")
        if metrics['test']['roc_auc']:
            print(f"  ROC-AUC:   {metrics['test']['roc_auc']:.4f}")
        
        print("\n📊 CONFUSION MATRIX (Test Set):")
        print(metrics['confusion_matrix_test'])
        
        print("\n📋 CLASSIFICATION REPORT (Test Set):")
        print(metrics['classification_report_test'])
        
        # Check for overfitting
        check_overfitting(metrics, threshold=0.10)
        
    except Exception as e:
        print(f"\n❌ LỖI: {str(e)}")
        import traceback
        traceback.print_exc()

