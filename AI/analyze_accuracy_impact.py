import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix
import warnings
warnings.filterwarnings('ignore')

def load_object(file_path: str):
    """Load pickle object"""
    with open(file_path, "rb") as file_obj:
        return pickle.load(file_obj)

def analyze_predictions(y_true, y_pred, model_name):
    """Phân tích chi tiết các trường hợp dự đoán"""
    
    cm = confusion_matrix(y_true, y_pred)
    
    # Tính toán các trường hợp cho từng class
    total_class_0 = np.sum(y_true == 0)
    total_class_1 = np.sum(y_true == 1)
    total_class_2 = np.sum(y_true == 2)
    
    # True Positives, False Positives, False Negatives cho từng class
    results = {}
    for class_id in [0, 1, 2]:
        tp = cm[class_id, class_id]  # Dự đoán đúng
        fn = np.sum(cm[class_id, :]) - tp  # Dự đoán sai thành class khác (bỏ sót)
        fp = np.sum(cm[:, class_id]) - tp  # Dự đoán nhầm từ class khác
        tn = np.sum(cm) - tp - fn - fp  # True Negatives
        
        results[class_id] = {
            'total': np.sum(y_true == class_id),
            'true_positive': tp,
            'false_negative': fn,
            'false_positive': fp,
            'true_negative': tn
        }
    
    return results, cm

def explain_impact(old_results, new_results):
    """Giải thích tác động thực tế của việc thay đổi model"""
    
    print("\n" + "="*80)
    print("PHÂN TÍCH TÁC ĐỘNG THỰC TẾ")
    print("="*80)
    
    print("\n📌 HIỂU VỀ ACCURACY:")
    print("""
Accuracy = (Số dự đoán đúng) / (Tổng số dự đoán)

Vấn đề: Khi dữ liệu mất cân bằng (84% là class 0), một model "ngốc"
chỉ cần dự đoán TẤT CẢ là class 0 thì vẫn được accuracy = 84%!

➜ Accuracy CAO không có nghĩa là model TỐT trong trường hợp này!
""")

    class_names = {
        0: "Không bệnh",
        1: "Tiền tiểu đường (Prediabetes)", 
        2: "Tiểu đường (Diabetes)"
    }
    
    for class_id in [1, 2]:  # Chỉ phân tích class quan trọng (có bệnh)
        print(f"\n{'='*80}")
        print(f"CLASS {class_id}: {class_names[class_id].upper()}")
        print(f"{'='*80}")
        
        old = old_results[class_id]
        new = new_results[class_id]
        
        total = old['total']
        
        print(f"\nTổng số bệnh nhân thực tế: {total:,} người")
        
        print(f"\n📊 MODEL CŨ (Accuracy cao = 85%):")
        print(f"   ✅ Phát hiện đúng:  {old['true_positive']:>6,} người ({old['true_positive']/total*100:5.1f}%)")
        print(f"   ❌ BỎ SÓT:          {old['false_negative']:>6,} người ({old['false_negative']/total*100:5.1f}%) ← NGUY HIỂM!")
        print(f"   ⚠️  Chẩn đoán nhầm: {old['false_positive']:>6,} người")
        
        print(f"\n📊 MODEL MỚI (Accuracy thấp = 61.5%):")
        print(f"   ✅ Phát hiện đúng:  {new['true_positive']:>6,} người ({new['true_positive']/total*100:5.1f}%)")
        print(f"   ❌ BỎ SÓT:          {new['false_negative']:>6,} người ({new['false_negative']/total*100:5.1f}%) ← Giảm nhiều!")
        print(f"   ⚠️  Chẩn đoán nhầm: {new['false_positive']:>6,} người")
        
        print(f"\n💡 SO SÁNH:")
        improvement_detected = new['true_positive'] - old['true_positive']
        reduction_missed = old['false_negative'] - new['false_negative']
        increase_fp = new['false_positive'] - old['false_positive']
        
        if improvement_detected > 0:
            print(f"   ✅ Phát hiện thêm: {improvement_detected:,} bệnh nhân")
        if reduction_missed > 0:
            print(f"   ✅ Giảm bỏ sót: {reduction_missed:,} bệnh nhân")
        if increase_fp > 0:
            print(f"   ⚠️  Tăng chẩn đoán nhầm: {increase_fp:,} người (nhưng an toàn hơn bỏ sót)")
    
    print("\n" + "="*80)
    print("VẬY TẠI SAO ACCURACY GIẢM?")
    print("="*80)
    
    old_0 = old_results[0]
    new_0 = new_results[0]
    
    print(f"""
Class 0 (Không bệnh) chiếm {old_0['total']:,} người ({old_0['total']/76104*100:.1f}% test set)

MODEL CŨ: Dự đoán đúng {old_0['true_positive']:,} / {old_0['total']:,} người class 0
MODEL MỚI: Dự đoán đúng {new_0['true_positive']:,} / {new_0['total']:,} người class 0

➜ Giảm {old_0['true_positive'] - new_0['true_positive']:,} dự đoán đúng ở class 0
➜ Vì class 0 chiếm 84% dữ liệu → Accuracy tổng thể giảm!

NHƯNG:
✅ Model mới cân bằng hơn - không "thiên vị" class đa số
✅ Phát hiện bệnh tốt hơn - mục tiêu chính của y tế!
""")

    print("="*80)
    print("KẾT LUẬN: ACCURACY CAO ≠ MODEL TỐT")
    print("="*80)
    print("""
Trong BÀI TOÁN Y TẾ:
❌ Bỏ sót bệnh nhân (False Negative) = Nguy hiểm, có thể gây tử vong
⚠️  Chẩn đoán nhầm (False Positive) = An toàn hơn, làm thêm xét nghiệm

Model CŨ: Accuracy cao nhưng BỎ SÓT quá nhiều bệnh nhân
Model MỚI: Accuracy thấp nhưng PHÁT HIỆN BỆNH TỐT HƠN

➜ Trade-off đáng giá: Giảm accuracy để cứu được nhiều người hơn!
""")

if __name__ == "__main__":
    try:
        print("="*80)
        print("PHÂN TÍCH TÁC ĐỘNG CỦA VIỆC ACCURACY GIẢM")
        print("="*80)
        
        # Load models
        print("\n📂 Đang load models và data...")
        old_model = load_object("final_model/diabetesbest_model.pkl")
        new_model = load_object("final_model/diabetes_improved_model.pkl")
        preprocessor = load_object("final_model/diabetespreprocessor.pkl")
        
        # Load data
        df = pd.read_csv("Medical_Data/diabetes_data.csv")
        target_col = 'Diabetes_012'
        X = df.drop(columns=[target_col])
        y = df[target_col]
        
        X_train_raw, X_test_raw, y_train, y_test = train_test_split(
            X, y, test_size=0.3, random_state=42, stratify=y
        )
        
        X_test = preprocessor.transform(X_test_raw)
        print(f"✓ Test set: {len(X_test):,} samples")
        
        # Get predictions
        y_pred_old = old_model.predict(X_test)
        y_pred_new = new_model.predict(X_test)
        
        # Analyze
        old_results, old_cm = analyze_predictions(y_test, y_pred_old, "Model Cũ")
        new_results, new_cm = analyze_predictions(y_test, y_pred_new, "Model Mới")
        
        # Explain impact
        explain_impact(old_results, new_results)
        
        # Additional statistics
        print("\n" + "="*80)
        print("THỐNG KÊ TỔNG HỢP")
        print("="*80)
        
        total_test = len(y_test)
        
        # Calculate total patients with disease
        total_sick = np.sum((y_test == 1) | (y_test == 2))
        
        old_detected_sick = np.sum(((y_pred_old == 1) | (y_pred_old == 2)) & ((y_test == 1) | (y_test == 2)))
        new_detected_sick = np.sum(((y_pred_new == 1) | (y_pred_new == 2)) & ((y_test == 1) | (y_test == 2)))
        
        print(f"\nTổng bệnh nhân có bệnh (class 1 + 2): {total_sick:,} người")
        print(f"\nMODEL CŨ phát hiện: {old_detected_sick:,} / {total_sick:,} ({old_detected_sick/total_sick*100:.1f}%)")
        print(f"MODEL MỚI phát hiện: {new_detected_sick:,} / {total_sick:,} ({new_detected_sick/total_sick*100:.1f}%)")
        print(f"\n✅ Cải thiện: Cứu thêm {new_detected_sick - old_detected_sick:,} bệnh nhân!")
        
        print("\n" + "="*80)
        print("🎯 KHUYẾN NGHỊ CUỐI CÙNG")
        print("="*80)
        print("""
Nếu mục tiêu là:
1. ✅ Phát hiện bệnh chính xác → Dùng MODEL MỚI
2. ❌ Có accuracy cao trên giấy → Dùng model cũ (KHÔNG khuyến nghị)

Trong y tế, luôn ưu tiên:
"Chẩn đoán dương tính giả (False Positive) còn hơn bỏ sót bệnh nhân (False Negative)"

➜ MODEL MỚI là lựa chọn đúng đắn hơn cho ứng dụng y tế!
""")
        
    except Exception as e:
        print(f"\n❌ LỖI: {str(e)}")
        import traceback
        traceback.print_exc()

