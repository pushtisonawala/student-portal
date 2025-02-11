const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  contactNumber: {
    type: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  education: {
    highSchool: {
      name: String,
      percentage: Number,
      yearOfCompletion: Number
    },
    intermediate: {
      name: String,
      percentage: Number,
      yearOfCompletion: Number
    }
  },
  marks: {
    mathematics: { type: Number, min: 0, max: 100 },
    science: { type: Number, min: 0, max: 100 },
    english: { type: Number, min: 0, max: 100 },
    history: { type: Number, min: 0, max: 100 }
  },
  calculatedGrade: String,
  calculatedAverage: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate grade based on average marks
ProfileSchema.virtual('grade').get(function() {
  if (!this.marks) return 'N/A';
  
  const subjects = ['mathematics', 'science', 'english', 'history'];
  const validMarks = subjects.filter(subject => 
    typeof this.marks[subject] === 'number' && !isNaN(this.marks[subject])
  );

  if (validMarks.length === 0) return 'N/A';

  const totalMarks = validMarks.reduce((sum, subject) => 
    sum + this.marks[subject], 0
  );
  
  const average = totalMarks / validMarks.length;
  
  if (average >= 90) return 'A+';
  if (average >= 80) return 'A';
  if (average >= 70) return 'B';
  if (average >= 60) return 'C';
  if (average >= 50) return 'D';
  return 'F';
});

// Add average calculation
ProfileSchema.virtual('average').get(function() {
  if (!this.marks) return 0;
  
  const subjects = ['mathematics', 'science', 'english', 'history'];
  const validMarks = subjects.filter(subject => 
    typeof this.marks[subject] === 'number' && !isNaN(this.marks[subject])
  );

  if (validMarks.length === 0) return 0;

  const totalMarks = validMarks.reduce((sum, subject) => 
    sum + this.marks[subject], 0
  );
  
  return (totalMarks / validMarks.length).toFixed(2);
});

// Calculate and save grade before saving
ProfileSchema.pre('save', function(next) {
  if (this.marks) {
    const subjects = ['mathematics', 'science', 'english', 'history'];
    const validMarks = subjects.filter(subject => 
      typeof this.marks[subject] === 'number' && !isNaN(this.marks[subject])
    );

    if (validMarks.length > 0) {
      const totalMarks = validMarks.reduce((sum, subject) => 
        sum + this.marks[subject], 0
      );
      
      const average = totalMarks / validMarks.length;
      this.calculatedAverage = parseFloat(average.toFixed(2));
      
      if (average >= 90) this.calculatedGrade = 'A+';
      else if (average >= 80) this.calculatedGrade = 'A';
      else if (average >= 70) this.calculatedGrade = 'B';
      else if (average >= 60) this.calculatedGrade = 'C';
      else if (average >= 50) this.calculatedGrade = 'D';
      else this.calculatedGrade = 'F';
    }
  }
  next();
});

// Make sure virtuals are included in response
ProfileSchema.set('toJSON', { virtuals: true });
ProfileSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Profile", ProfileSchema);
