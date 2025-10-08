<div align="center">

**A simple, database-free flashcard application for efficient exam preparation**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

</div>

---

## About
Created by **Jule Cyrus Fernandez** to address the need for a straightforward study tool during exam preparation. This project focuses on **ease of use** without the complexity of backend databases or server configurations.

> *"Study smarter, not harder - with zero setup time."*

## Features
- **No Database Required** - All data stored locally in browser memory
- **Subject & Topic Organization** - Structure your study materials logically
- **Multiple Question Types** - Support for identification and enumeration questions
- **Randomized Quizzes** - Test yourself with shuffled questions
- **Simple Interface** - Clean, intuitive design for distraction-free studying
---
## 🛠️ Tech Stack
| Technology | Purpose |
|------------|---------|
| **React JS** | Component-based UI framework |
| **Tailwind CSS** | Utility-first styling |
| **Lucide React** | Beautiful icon library |
---
## 💾 Data Storage
All flashcard data is stored in **React state** during your session. Use the **Export JSON** feature to save your work permanently. Import the JSON file in future sessions to restore your flashcards.
> 💡 **Tip**: Regularly export your flashcards to avoid losing your work!
---
## 📄 JSON Format

```json
{
  "subjects": [
    {
      "name": "Mathematics",
      "topics": [
        {
          "name": "Algebra",
          "cards": [
            {
              "question": "What is x in 2x + 4 = 10?",
              "answer": "x = 3",
              "type": "identification"
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 📸 Screenshots

<div align="center">

### Start Screen
*Import existing flashcards or start fresh*

### Dashboard
*View all subjects and topics at a glance*

### Card Builder
*Create and organize your flashcards*

### Quiz Mode
*Test your knowledge with randomized questions*

</div>

## 📝 License
Free to use for **personal and educational purposes**
## **Jule Cyrus Fernandez**
Built with ❤️ and the goal of making exam preparation simpler and more accessible.
---
<div align="center">
### ⭐ If this helped you study, consider giving it a star!

**Happy Studying! 📚✨**

</div>
