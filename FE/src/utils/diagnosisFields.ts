  // Định nghĩa cấu trúc các trường chẩn đoán

  export const diagnosisFields = [
    {
      name: 'HighBP',
      label: 'Huyết áp cao',
      hint: 'Bạn có bị tăng huyết áp không?',
      type: 'select' as const,
      options: [
        { value: 0, label: 'Không' },
        { value: 1, label: 'Có' }
      ]
    },
    {
      name: 'HighChol',
      label: 'Cholesterol cao',
      hint: 'Bạn có bị mỡ máu cao không?',
      type: 'select' as const,
      options: [
        { value: 0, label: 'Không' },
        { value: 1, label: 'Có' }
      ]
    },
    {
      name: 'CholCheck',
      label: 'Kiểm tra cholesterol',
      hint: 'Bạn có kiểm tra cholesterol trong 5 năm qua không?',
      type: 'select' as const,
      options: [
        { value: 0, label: 'Không' },
        { value: 1, label: 'Có' }
      ]
    },
    {
      name: 'BMI',
      label: 'Chỉ số BMI',
      hint: 'Nhập BMI của bạn hoặc dùng máy tính bên dưới',
      type: 'number' as const,
      min: 10,
      max: 60,
      step: 0.1
    },
    {
      name: 'Smoker',
      label: 'Hút thuốc',
      hint: 'Bạn có hút thuốc (≥100 điếu trong đời) không?',
      type: 'select' as const,
      options: [
        { value: 0, label: 'Không' },
        { value: 1, label: 'Có' }
      ]
    },
    {
      name: 'Stroke',
      label: 'Đột quỵ',
      hint: 'Bạn có từng bị đột quỵ không?',
      type: 'select' as const,
      options: [
        { value: 0, label: 'Không' },
        { value: 1, label: 'Có' }
      ]
    },
    {
      name: 'HeartDiseaseorAttack',
      label: 'Bệnh tim/Nhồi máu',
      hint: 'Bạn có từng bị bệnh tim hoặc nhồi máu cơ tim không?',
      type: 'select' as const,
      options: [
        { value: 0, label: 'Không' },
        { value: 1, label: 'Có' }
      ]
    },
    {
      name: 'PhysActivity',
      label: 'Hoạt động thể chất',
      hint: 'Bạn có tập thể dục ngoài công việc không?',
      type: 'select' as const,
      options: [
        { value: 0, label: 'Không' },
        { value: 1, label: 'Có' }
      ]
    },
    {
      name: 'Fruits',
      label: 'Ăn hoa quả',
      hint: 'Bạn có ăn hoa quả ít nhất 1 lần/ngày không?',
      type: 'select' as const,
      options: [
        { value: 0, label: 'Không' },
        { value: 1, label: 'Có' }
      ]
    },
    {
      name: 'Veggies',
      label: 'Ăn rau xanh',
      hint: 'Bạn có ăn rau ít nhất 1 lần/ngày không?',
      type: 'select' as const,
      options: [
        { value: 0, label: 'Không' },
        { value: 1, label: 'Có' }
      ]
    },
    {
      name: 'HvyAlcoholConsump',
      label: 'Uống rượu nhiều',
      hint: 'Nam >14 ly/tuần, Nữ >7 ly/tuần',
      type: 'select' as const,
      options: [
        { value: 0, label: 'Không' },
        { value: 1, label: 'Có' }
      ]
    },
    {
      name: 'AnyHealthcare',
      label: 'Bảo hiểm y tế',
      hint: 'Bạn có bảo hiểm y tế hoặc tiếp cận chăm sóc y tế không?',
      type: 'select' as const,
      options: [
        { value: 0, label: 'Không' },
        { value: 1, label: 'Có' }
      ]
    },
    {
      name: 'NoDocbcCost',
      label: 'Bỏ khám vì chi phí',
      hint: 'Có lần nào bỏ khám vì chi phí trong 12 tháng qua không?',
      type: 'select' as const,
      options: [
        { value: 0, label: 'Không' },
        { value: 1, label: 'Có' }
      ]
    },
    {
      name: 'GenHlth',
      label: 'Sức khỏe tổng quát',
      hint: 'Bạn đánh giá sức khỏe của mình thế nào?',
      type: 'select' as const,
      options: [
        { value: 1, label: '1 - Tuyệt vời' },
        { value: 2, label: '2 - Rất tốt' },
        { value: 3, label: '3 - Tốt' },
        { value: 4, label: '4 - Trung bình' },
        { value: 5, label: '5 - Kém' }
      ]
    },
    {
      name: 'MentHlth',
      label: 'Sức khỏe tinh thần',
      hint: 'Số ngày tinh thần không tốt trong 30 ngày qua (0-30)',
      type: 'number' as const,
      min: 0,
      max: 30,
      step: 1
    },
    {
      name: 'PhysHlth',
      label: 'Sức khỏe thể chất',
      hint: 'Số ngày sức khỏe thể chất không tốt trong 30 ngày qua (0-30)',
      type: 'number' as const,
      min: 0,
      max: 30,
      step: 1
    },
    {
      name: 'DiffWalk',
      label: 'Khó khăn khi đi lại',
      hint: 'Bạn có khó khăn khi đi lại hoặc leo cầu thang không?',
      type: 'select' as const,
      options: [
        { value: 0, label: 'Không' },
        { value: 1, label: 'Có' }
      ]
    },
    {
      name: 'Sex',
      label: 'Giới tính',
      hint: 'Giới tính của bạn',
      type: 'select' as const,
      options: [
        { value: 0, label: 'Nữ' },
        { value: 1, label: 'Nam' }
      ]
    },
    {
      name: 'Age',
      label: 'Nhóm tuổi',
      hint: 'Chọn nhóm tuổi của bạn',
      type: 'select' as const,
      options: [
        { value: 1, label: '18-24 tuổi' },
        { value: 2, label: '25-29 tuổi' },
        { value: 3, label: '30-34 tuổi' },
        { value: 4, label: '35-39 tuổi' },
        { value: 5, label: '40-44 tuổi' },
        { value: 6, label: '45-49 tuổi' },
        { value: 7, label: '50-54 tuổi' },
        { value: 8, label: '55-59 tuổi' },
        { value: 9, label: '60-64 tuổi' },
        { value: 10, label: '65-69 tuổi' },
        { value: 11, label: '70-74 tuổi' },
        { value: 12, label: '75-79 tuổi' },
        { value: 13, label: '80+ tuổi' }
      ]
    },
    {
      name: 'Education',
      label: 'Trình độ học vấn',
      hint: 'Trình độ học vấn cao nhất của bạn',
      type: 'select' as const,
      options: [
        { value: 1, label: 'Chưa học xong tiểu học' },
        { value: 2, label: 'Học xong tiểu học' },
        { value: 3, label: 'Học xong trung học cơ sở' },
        { value: 4, label: 'Học một phần trung học phổ thông' },
        { value: 5, label: 'Tốt nghiệp trung học phổ thông' },
        { value: 6, label: 'Cao đẳng/Đại học trở lên' }
      ]
    },
    {
      name: 'Income',
      label: 'Thu nhập',
      hint: 'Mức thu nhập hàng năm của bạn (USD)',
      type: 'select' as const,
      options: [
        { value: 1, label: '< $10,000' },
        { value: 2, label: '$10,000 - $15,000' },
        { value: 3, label: '$15,000 - $20,000' },
        { value: 4, label: '$20,000 - $25,000' },
        { value: 5, label: '$25,000 - $35,000' },
        { value: 6, label: '$35,000 - $50,000' },
        { value: 7, label: '$50,000 - $75,000' },
        { value: 8, label: '≥ $75,000' }
      ]
    }
  ];

  // Hàm tạo giá trị mặc định cho form
  export function getDefaultFormValues(): Record<string, number> {
    const defaults: Record<string, number> = {};
    
    diagnosisFields.forEach(field => {
      if (field.type === 'select' && field.options) {
        defaults[field.name] = field.options[0].value;
      } else if (field.type === 'number') {
        defaults[field.name] = field.min || 0;
      }
    });
    
    return defaults;
  }

