// функция перевода массива в строку
function ConvertToString(mesInt, lang) {
  let result = "";
  if (lang == "en") {
    mesInt.map((letter) => (result += String.fromCharCode(letter + 96)));
    return result;
  } else if (lang == "ru") {
    mesInt.map((letter) => (result += String.fromCharCode(letter + 1071)));
    return result;
  }
}

// функция шифрования сообщения
function EncOrDecnMessage(mes, key, N) {
  let M = [];
  for (let i = 0; i < mes.length; i++) {
    M[i] = mes[i] ** key % N;
  }
  return M;
}

// функция перевода сообщения в массив целых чисел
function ConvertToInt(mes, lang) {
  if (lang == "en") {
    return Array.from(mes).map(
      (letter) => letter.toLowerCase().charCodeAt(0) - 96
    );
  } else if (lang == "ru") {
    return Array.from(mes).map(
      (letter) => letter.toLowerCase().charCodeAt(0) - 1071
    );
  }
}

// функция поиска секретного ключа алгоритмом Евклида
function FindSecretKey(N, a) {
  let u = [0, 1, N];
  let v = [1, 0, a];

  while (u[2] != 1) {
    let q = Math.floor(u[2] / v[2]);
    let t = [];
    for (let i = 0; i < u.length; i++) {
      t[i] = u[i] - v[i] * q;
    }
    u = v.map((item) => item);
    v = t.map((item) => item);
  }

  let expres = (a * u[0] + N * u[1]) % N;
  if (expres == 1 && expres == (a * u[0]) % N) {
    return u[0] % N;
  }
  return "Error";
}

// функция поиска НОД
function NOD(left, right) {
  if (right > 0) {
    var k = left % right;
    return NOD(right, k);
  } else {
    return Math.abs(left);
  }
}

// функция поиска открытого ключа
function FindOpenKey(valEulerFunc) {
  let min = 2;
  let max = valEulerFunc;
  let K = Math.floor(Math.random() * (max - min + 1)) + min;

  while (NOD(K, valEulerFunc) != 1) {
    K = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return K;
}

// алгоритм RSA
function RSA(params) {
  let valueN = params.valueP * params.valueQ;
  console.log("N", valueN);

  // значение функции Эйлера
  let funcEuler = (params.valueP - 1) * (params.valueQ - 1);
  console.log("Euler", funcEuler);

  // поиск открытого ключа
  let keyOpen = FindOpenKey(funcEuler);

  // поиск секретного ключа
  let secretKey = FindSecretKey(funcEuler, keyOpen);

  while (secretKey == "Error") {
    keyOpen = FindOpenKey(funcEuler);
    secretKey = FindSecretKey(funcEuler, keyOpen);
  }
  console.log("проверка", (keyOpen * secretKey) % funcEuler);
  console.log("K", keyOpen);
  console.log("k", secretKey);

  // перевод сообщения в массив целых чисел
  let messageToInt = ConvertToInt(params.messageM, params.mesLanguage);
  console.log("конвертация:", messageToInt);

  // шифрование сообщения M
  let encMessage = EncOrDecnMessage(messageToInt, keyOpen, valueN);
  console.log("enc", encMessage);

  // расшифровка сообщения M
  let decMessage = EncOrDecnMessage(encMessage, secretKey, valueN);
  console.log("dec", decMessage);

  console.log("lang", params.mesLanguage);
  return ConvertToString(decMessage, params.mesLanguage);
}

export default RSA;
