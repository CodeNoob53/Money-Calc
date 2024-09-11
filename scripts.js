// Функція для перемикання фокусу між полями введення
function moveToNext(event) {
  console.log("moveToNext викликано"); // Додано для перевірки

  // Перевіряємо, чи модальне вікно калькулятора не активне
  const calculatorModal = document.getElementById('calculatorModal');
  if (calculatorModal && calculatorModal.style.display === 'block') {
    console.log("Модальне вікно активне, фокус заблокований");
    return;
  }

  if (event.key === "Enter" || event.code === "Space") {
    event.preventDefault();

    let inputs = Array.from(document.querySelectorAll('input[type="number"]'));
    let currentIndex = inputs.indexOf(event.target);

    if (currentIndex !== -1) {
      let nextIndex = currentIndex + 1;

      if (nextIndex < inputs.length) {
        inputs[nextIndex].focus();
      } else {
        console.log("Повертаємося до першого поля");
        document.getElementById('thousand-bill').focus(); // Прямо вказуємо перше поле
      }
    }
  }
}



// Функція форматування чисел для відображення суми
function formatAmount(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Ініціалізація елементів
const toggleThemeButton = document.getElementById('toggleThemeButton');
const bodyElement = document.body;
const containerElement = document.querySelector('.container');
const themeIcon = toggleThemeButton.querySelector('.icon');
const themeText = toggleThemeButton.querySelector('.text');
// Ініціалізація елементів для калькулятора
const calculatorButton = document.getElementById('calculatorButton');
const calculatorModal = document.getElementById('calculatorModal');
const closeCalculator = calculatorModal.querySelector('.close');
const calculatorInput = document.getElementById('calculator-input');
const differenceResult = document.getElementById('difference-result');
const currentTotalElement = document.getElementById('current-total');
const totalElement = document.getElementById("total");

// Ініціалізація масиву для зберігання даних
let history = [];

// Перевірка налаштування теми в localStorage
const storedTheme = localStorage.getItem('theme');
if (storedTheme === 'dark') {
    applyTheme('dark');
} else {
    applyTheme('light');
}

// Додаємо подію відкриття модального вікна при натисканні на кнопку
calculatorButton.addEventListener('click', function() {
    // Перевірка, чи заповнене хоча б одне поле перед відкриттям калькулятора
    if (!validateInputs()) {
        alert('Please fill in at least one field. \nБудь ласка, заповніть хоча б одне поле.');
        return;
    }
    // Оновлення значення total в модальному вікні
    const totalValue = parseInt(totalElement.querySelector("span").innerText.replace(/[^\d]/g, "")) || 0;
    currentTotalElement.innerText = formatAmount(totalValue);
    differenceResult.innerText = ''; // Очищення поля різниці
    calculatorInput.value = ''; // Очищення введеного значення
    calculatorModal.style.display = 'block';
});

// Закриття калькулятора
closeCalculator.addEventListener('click', () => {
  calculatorModal.style.display = 'none';
  calculatorInput.value = ''; // Скидання значення введеного числа
  differenceResult.innerText = ''; // Очищення поля різниці
    // Повернення фокуса на основну сторінку
  document.getElementById('thousand-bill').focus();
});

// Розрахунок різниці між total amount і введеним значенням
calculatorInput.addEventListener('input', () => {
  if (calculatorInput.value.trim() === '') {
    differenceResult.innerText = ''; // Очищення поля різниці, якщо немає значення
    return;
  }
  const inputValue = parseInt(calculatorInput.value, 10) || 0;
  const currentTotal = parseInt(currentTotalElement.innerText.replace(/[^\d]/g, "")) || 0;
  const difference = currentTotal - inputValue;
  differenceResult.innerText = formatAmount(difference);
  differenceResult.style.color = difference >= 0 ? "green" : "red";
});

// Закриття модального вікна при натисканні на область поза вікном
window.addEventListener('click', (event) => {
  if (event.target == calculatorModal) {
      calculatorModal.style.display = 'none';
      calculatorInput.value = ''; // Скидання значення введеного числа
      differenceResult.innerText = ''; // Очищення поля різниці
  }
});

// Обробник події кнопки перемикання теми
toggleThemeButton.addEventListener('click', () => {
  const isDarkTheme = bodyElement.classList.contains('dark-theme');
  const newTheme = isDarkTheme ? 'light' : 'dark';
  applyTheme(newTheme);
  try {
      localStorage.setItem('theme', newTheme);
  } catch (e) {
      console.error('Error saving theme preference to localStorage', e);
  }
});

function applyTheme(theme) {
  if (theme === 'dark') {
    bodyElement.classList.add('dark-theme');
    bodyElement.classList.remove('light-theme');
    themeIcon.style.backgroundImage = "url('img/sun-icon.svg')";
    themeText.innerText = 'Темна тема';
    // Оновлення стилів кнопки калькулятора для темної теми
    calculatorButton.style.backgroundColor = '#333';
    calculatorButton.style.color = '#fff';
  } else {
    bodyElement.classList.add('light-theme');
    bodyElement.classList.remove('dark-theme');
    themeIcon.style.backgroundImage = "url('img/moon-icon.svg')";
    themeText.innerText = 'Світла тема';
    // Оновлення стилів кнопки калькулятора для світлої теми
    calculatorButton.style.backgroundColor = '#fff';
    calculatorButton.style.color = '#000';
  }
}

// Очищення полів вводу
document.querySelectorAll('input[type="number"]').forEach(input => {
  input.addEventListener('input', () => {
    if (input.value.trim() === '') {
      input.value = ''; // Залишити поле пустим
    } else {
      input.value = parseInt(input.value, 10); // Перетворити в десяткове число
    }
    calculateTotal();
  });
});

// Функція для валідації, чи заповнене хоча б одне поле
function validateInputs() {
  const inputs = document.querySelectorAll('input[type="number"]');
  return [...inputs].some(input => !isNaN(input.value) && input.value.trim() !== '');
}

function saveResult() {
  // Повідомлення про незаповнене хоча б одне поле
  if (!validateInputs()) {
      alert('Please fill in at least one field. \nБудь ласка, заповніть хоча б одне поле.');
      return;
  }

  // Отримати значення поточних купюр і монет
  const getValues = () => {
      const values = {
          thousandBill: parseInt(document.getElementById("thousand-bill").value, 10) || 0,
          fiveHundredBill: parseInt(document.getElementById("five-hundred-bill").value, 10) || 0,
          twoHundredBill: parseInt(document.getElementById("two-hundred-bill").value, 10) || 0,
          hundredBill: parseInt(document.getElementById("hundred-bill").value, 10) || 0,
          fiftyBill: parseInt(document.getElementById("fifty-bill").value, 10) || 0,
          twentyBill: parseInt(document.getElementById("twenty-bill").value, 10) || 0,
          tenBill: parseInt(document.getElementById("ten-bill").value, 10) || 0,
          fiveBill: parseInt(document.getElementById("five-bill").value, 10) || 0,
          twoBill: parseInt(document.getElementById("two-bill").value, 10) || 0,
          oneBill: parseInt(document.getElementById("one-bill").value, 10) || 0,
          tenCoin: parseInt(document.getElementById("ten-coin").value, 10) || 0,
          fiveCoin: parseInt(document.getElementById("five-coin").value, 10) || 0,
          twoCoin: parseInt(document.getElementById("two-coin").value, 10) || 0,
          oneCoin: parseInt(document.getElementById("one-coin").value, 10) || 0
      };
      return values;
  };

  // Додати дані в історію
  const total = parseInt(totalElement.querySelector("span").innerText.replace(/[^\d]/g, "")) || 0;
  const newRecord = {
      time: new Date().toLocaleString(),
      total: total,
      denominations: getValues()
  };
  history.push(newRecord);

  // Додати новий рядок у таблицю
  const savedResultsBody = document.getElementById("saved-results-body");
  const newRow = document.createElement("tr");
  newRow.innerHTML = `<td>${newRecord.time}</td><td>${formatAmount(newRecord.total)} грн</td><td></td>`;
  savedResultsBody.prepend(newRow);

  // Розрахунок різниці
  const rows = savedResultsBody.querySelectorAll("tr");
  if (rows.length > 1) {
      const previousTotal = parseInt(rows[1].querySelector("td:nth-child(2)").innerText.replace(/[^\d]/g, "")) || 0;
      const difference = newRecord.total - previousTotal;
      const differenceText = difference >= 0 ? `+${formatAmount(difference)} грн` : `-${formatAmount(Math.abs(difference))} грн`;
      const differenceCell = newRow.querySelector("td:nth-child(3)");
      differenceCell.innerText = differenceText;
      differenceCell.style.color = difference >= 0 ? "green" : "red";
  }

  // Обмеження збережених результатів до 5
  if (savedResultsBody.children.length > 5) {
      savedResultsBody.removeChild(savedResultsBody.lastChild);
  }
}


// Анімація оновлення суми з перевіркою на наявність поточної анімації
function calculateTotal() {
  const total = [
    { id: "thousand-bill", value: 1000 },
    { id: "five-hundred-bill", value: 500 },
    { id: "two-hundred-bill", value: 200 },
    { id: "hundred-bill", value: 100 },
    { id: "fifty-bill", value: 50 },
    { id: "twenty-bill", value: 20 },
    { id: "ten-bill", value: 10 },
    { id: "five-bill", value: 5 },
    { id: "two-bill", value: 2 },
    { id: "one-bill", value: 1 },
    { id: "ten-coin", value: 10 },
    { id: "five-coin", value: 5 },
    { id: "two-coin", value: 2 },
    { id: "one-coin", value: 1 }
  ].reduce((sum, { id, value }) => sum + (parseInt(document.getElementById(id).value, 10) || 0) * value, 0);

  const formattedTotal = formatAmount(total);
  const totalElement = document.getElementById("total");
  const totalSpan = totalElement.querySelector("span");

  let currentTotal = parseInt(totalSpan.innerText.replace(/[^\d]/g, "")) || 0;
  const increment = total - currentTotal;
  const step = increment / 10;
  let current = currentTotal;

  // Очищення попередньої анімації
  if (totalElement.animation) {
    clearInterval(totalElement.animation);
  }

  totalElement.animation = setInterval(() => {
    current += step;
    totalSpan.innerText = `${formatAmount(Math.round(current))}`;
    if ((increment > 0 && current >= total) || (increment < 0 && current <= total)) {
      clearInterval(totalElement.animation);
      totalSpan.innerText = `${formattedTotal} грн`;
    }
  }, 50);
}

function clearFields() {
  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.value = ""; // Очистити всі поля вводу
  });
  calculateTotal(); // Скинути загальну суму після очищення полів
}

function clearTable() {
  document.getElementById("saved-results-body").innerHTML = "";
}

function saveToXlsx() {
  const savedResultsBody = document.getElementById("saved-results-body");
  if (savedResultsBody.children.length === 0) {
      alert('No saved results to export. \nНемає збережених результатів для експорту.');
      return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Saved Results");

  // Додавання стовпців до робочого аркушу
  worksheet.columns = [
      { header: "Час", key: "time", width: 25 },
      { header: "Сума", key: "total", width: 25 },
      { header: "Різниця (+/-)", key: "difference", width: 15 },
      { header: "1000 грн", key: "thousandBill", width: 10 },
      { header: "500 грн", key: "fiveHundredBill", width: 10 },
      { header: "200 грн", key: "twoHundredBill", width: 10 },
      { header: "100 грн", key: "hundredBill", width: 10 },
      { header: "50 грн", key: "fiftyBill", width: 10 },
      { header: "20 грн", key: "twentyBill", width: 10 },
      { header: "10 грн", key: "tenBill", width: 10 },
      { header: "5 грн", key: "fiveBill", width: 10 },
      { header: "2 грн", key: "twoBill", width: 10 },
      { header: "1 грн", key: "oneBill", width: 10 },
      { header: "10 грн монети", key: "tenCoin", width: 15 },
      { header: "5 грн монети", key: "fiveCoin", width: 15 },
      { header: "2 грн монети", key: "twoCoin", width: 15 },
      { header: "1 грн монети", key: "oneCoin", width: 15 }
  ];

  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0070C0' } };
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  history.forEach((record, index) => {
      let difference = '';
      if (index > 0) {
          const previousTotal = history[index - 1].total;
          const currentTotal = record.total;
          const differenceValue = currentTotal - previousTotal;
          difference = differenceValue >= 0 ? `+${formatAmount(differenceValue)} грн` : `-${formatAmount(Math.abs(differenceValue))} грн`;
      }

      const row = worksheet.addRow({
          time: record.time,
          total: `${formatAmount(record.total)} грн`,
          difference: difference,
          ...record.denominations
      });

      row.alignment = { vertical: 'middle', horizontal: 'center' };
      row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE699' } };

      if (difference.startsWith('+')) {
          row.getCell('difference').font = { color: { argb: 'FF00B050' } };
      } else if (difference.startsWith('-')) {
          row.getCell('difference').font = { color: { argb: 'FFFF0000' } };
      }

      // Додавання бордерів до клітинок
      row.eachCell({ includeEmpty: true }, (cell) => {
          cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
          };
      });
  });

  // Отримання поточної дати та часу
  const now = new Date();
  const dateTimeString = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}`;

  // Збереження Excel файлу
  workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, `Saved_Results_${dateTimeString}.xlsx`);
  }).catch(error => {
      console.error('Error saving Excel file:', error);
  });
}
