import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, 
    recall_score, 
    f1_score,
    classification_report,
    confusion_matrix
)
import warnings
warnings.filterwarnings('ignore')

def load_object(file_path: str):
    """Load pickle object"""
    with open(file_path, "rb") as file_obj:
        return pickle.load(file_obj)

def compare_models(old_model, new_model, X_test, y_test):
    """Compare two models side by side"""
    
    y_pred_old = old_model.predict(X_test)
    y_pred_new = new_model.predict(X_test)
    
    # Calculate metrics for both models
    metrics = {
        'old': {
            'accuracy': accuracy_score(y_test, y_pred_old),
            'f1': f1_score(y_test, y_pred_old, average='weighted'),
            'recall_per_class': recall_score(y_test, y_pred_old, average=None),
            'confusion_matrix': confusion_matrix(y_test, y_pred_old)
        },
        'new': {
            'accuracy': accuracy_score(y_test, y_pred_new),
            'f1': f1_score(y_test, y_pred_new, average='weighted'),
            'recall_per_class': recall_score(y_test, y_pred_new, average=None),
            'confusion_matrix': confusion_matrix(y_test, y_pred_new)
        }
    }
    
    print("="*80)
    print("SO SÁNH MODEL CŨ VS MODEL MỚI")
    print("="*80)
    
    print("\n📊 METRICS TỔNG QUAN:")
    print(f"{'Metric':<20} {'Model Cũ':<15} {'Model Mới':<15} {'Thay đổi':<15}")
    print("-"*70)
    
    old_acc = metrics['old']['accuracy']
    new_acc = metrics['new']['accuracy']
    print(f"{'Accuracy':<20} {old_acc:<15.4f} {new_acc:<15.4f} {(new_acc-old_acc):<+15.4f}")
    
    old_f1 = metrics['old']['f1']
    new_f1 = metrics['new']['f1']
    print(f"{'F1-Score (weighted)':<20} {old_f1:<15.4f} {new_f1:<15.4f} {(new_f1-old_f1):<+15.4f}")
    
    print("\n📈 RECALL THEO TỪNG CLASS (Quan trọng nhất!):")
    print(f"{'Class':<20} {'Model Cũ':<15} {'Model Mới':<15} {'Cải thiện':<15}")
    print("-"*70)
    
    class_names = ['Class 0 (Không bệnh)', 'Class 1 (Prediabetes)', 'Class 2 (Diabetes)']
    improvements = []
    
    for i, name in enumerate(class_names):
        old_recall = metrics['old']['recall_per_class'][i]
        new_recall = metrics['new']['recall_per_class'][i]
        improvement = new_recall - old_recall
        improvements.append(improvement)
        
        emoji = "✅" if improvement > 0 else "❌" if improvement < 0 else "➖"
        print(f"{name:<20} {old_recall:<15.4f} {new_recall:<15.4f} {improvement:+15.4f} {emoji}")
    
    # Average recall (macro)
    old_avg_recall = np.mean(metrics['old']['recall_per_class'])
    new_avg_recall = np.mean(metrics['new']['recall_per_class'])
    print("-"*70)
    print(f"{'Average Recall':<20} {old_avg_recall:<15.4f} {new_avg_recall:<15.4f} {(new_avg_recall-old_avg_recall):+15.4f}")
    
    print("\n🔍 CONFUSION MATRIX COMPARISON:")
    
    print("\n📌 Model Cũ:")
    print(metrics['old']['confusion_matrix'])
    
    print("\n📌 Model Mới:")
    print(metrics['new']['confusion_matrix'])
    
    print("\n" + "="*80)
    print("PHÂN TÍCH")
    print("="*80)
    
    if improvements[1] > 0.1 or improvements[2] > 0.1:
        print("\n✅ Model mới TỐT HƠN đáng kể:")
        if improvements[1] > 0.1:
            print(f"   ✓ Phát hiện Prediabetes tốt hơn {improvements[1]*100:.1f}%")
        if improvements[2] > 0.1:
            print(f"   ✓ Phát hiện Diabetes tốt hơn {improvements[2]*100:.1f}%")
        print("\n   💡 Đây là điều QUAN TRỌNG trong y tế - phát hiện bệnh chính xác hơn!")
        print("   💡 Trade-off: Accuracy tổng thể có thể giảm, nhưng đáng giá!")
    
    if old_acc - new_acc > 0.05:
        print(f"\n⚠️  Lưu ý: Accuracy giảm {(old_acc-new_acc)*100:.1f}%")
        print("   Nhưng đây là acceptable vì:")
        print("   - Model cũ chỉ tốt ở class 0 (phần lớn dữ liệu)")
        print("   - Model mới cân bằng hơn, phát hiện bệnh tốt hơn")
    
    print("\n" + "="*80)
    print("KHUYẾN NGHỊ")
    print("="*80)
    
    if new_avg_recall > old_avg_recall:
        print("\n✅ NÊN SỬ DỤNG MODEL MỚI vì:")
        print("   1. Phát hiện bệnh tiểu đường tốt hơn (recall cao hơn)")
        print("   2. Performance cân bằng hơn giữa các classes")
        print("   3. Giảm False Negative (bỏ sót bệnh nhân) - rất quan trọng!")
        print("\n   Để thay thế model cũ:")
        print("   >>> import shutil")
        print("   >>> shutil.copy('final_model/diabetes_improved_model.pkl',")
        print("   ...             'final_model/diabetesbest_model.pkl')")
    else:
        print("\n⚠️  Cân nhắc giữ model cũ hoặc thử thêm phương pháp khác")

if __name__ == "__main__":
    try:
        print("\n" + "="*80)
        print("ĐÁNH GIÁ VÀ SO SÁNH MODELS")
        print("="*80)
        
        # Load models
        print("\n📂 Đang load models...")
        old_model = load_object("final_model/diabetesbest_model.pkl")
        new_model = load_object("final_model/diabetes_improved_model.pkl")
        preprocessor = load_object("final_model/diabetespreprocessor.pkl")
        print("✓ Loaded old model:", type(old_model).__name__)
        print("✓ Loaded new model:", type(new_model).__name__)
        
        # Load and prepare data
        print("\n📊 Đang load dữ liệu...")
        df = pd.read_csv("Medical_Data/diabetes_data.csv")
        
        target_col = 'Diabetes_012'
        X = df.drop(columns=[target_col])
        y = df[target_col]
        
        X_train_raw, X_test_raw, y_train, y_test = train_test_split(
            X, y, test_size=0.3, random_state=42, stratify=y
        )
        
        X_test = preprocessor.transform(X_test_raw)
        print(f"✓ Test set: {len(X_test):,} samples")
        
        # Compare models
        compare_models(old_model, new_model, X_test, y_test)
        
    except Exception as e:
        print(f"\n❌ LỖI: {str(e)}")
        import traceback
        traceback.print_exc()

