var mexp = require("math-expression-evaluator");

// функция подстановки блоками S
function SubstitutionS(array) {
  let subArr_for_S = [];
  for (let i = 0; i < 8; i++) {
    subArr_for_S[i] = array.slice(i * 4, (i + 1) * 4);
  }
}

// функция шифрования блока
function IncriptionBlock(N1, N2, key) {
  let sumMod2_32 = [],
    K = 0;
  console.log("N1", N1, "N2", N2);
  key.map((item, index) => (K += item * 2 ** (32 - index - 1)));
  for (let i = 0; i < N1.length; i++) {
    let a = 0,
      b = 0;

    N1[i].forEach((item, index) => {
      a += item * 2 ** (32 - index - 1);
    });
    N2[i].forEach((item, index) => {
      b += item * 2 ** (32 - index - 1);
    });
    //let sum = a+K;
    //console.log("result", mexp.eval("Mod2^32"));
    // sumMod2_32[i] = ConvertToBinary([Math.abs((a + K) % 2 ** 32) ^ b], 32);
    //console.log("тот самый", sumMod2_32)
    sumMod2_32[i] = ConvertToBinary(
      [a + K < 2 ** 32 ? (a + K) ^ b : (a + K - 2 ** 32) ^ b],
      32
    );
    // процесс подстановки в модуле S
    //let moduleS = SubstitutionS(sumMod2_32);
  }
  return sumMod2_32;
}

// функция генерации ключей
function GenerateKeys() {
  let K = [];
  for (let i = 0; i < 8; i++) {
    K[i] = Array.from({ length: 32 }, () => Math.floor(Math.random() * 2));
  }
  return K;
}

// функция разбиения на блоки
function Blocking(mes) {
  let block = [],
    countBlocks = Math.ceil(mes.length / 64),
    remain = 64 - (mes.length % 64);

  for (let i = 0; i < countBlocks; i++) {
    block[i] = mes.slice(64 * i, (i + 1) * 64);
    if (remain != 0 && i == countBlocks - 1) {
      Array(remain)
        .fill(0)
        .map((item) => block[i].push(item));
    }
  }
  return block;
}

// функция перевода сообщения в массив целых чисел
function ConvertToInt(mes, lang) {
  if (lang == "en") {
    return Array.from(mes).map((letter) => letter.toLowerCase().charCodeAt(0));
  } else if (lang == "ru") {
    return Array.from(mes).map((letter) => letter.toLowerCase().charCodeAt(0));
  }
}

// функция перевода массива чисел в бинарный вид
function ConvertToBinary(massInt, countBit) {
  let binaryArr = "";
  for (let item of massInt) {
    let binary = (item % 2).toString();
    for (; item > 1; ) {
      item = parseInt(item / 2);
      binary = (item % 2) + binary;
    }
    binaryArr += "0".repeat(countBit - binary.length) + binary;
  }
  return binaryArr.split("").map((item) => parseInt(item));
}

// функция блочного шифрования по ГОСТ 28147-89 в режиме простой замены
function GOSTEasySwap(params) {
  console.log(5 ^ 2);
  /*
      TODO: процесс блочного шифрования сообщения
   */

  // перевод сообщения в массив целых чисел
  let messageToInt = ConvertToInt(params.messageM, params.mesLanguage);
  let messageToBin = ConvertToBinary(messageToInt, 8);
  console.log(messageToInt);

  // разбиение на блоки
  let blocks = Blocking(messageToBin);

  // генерация ключей
  const keys = GenerateKeys(),
    keysInc = [].concat(keys.reverse(), keys.reverse(), keys.reverse(), keys);
  let hoarderN1 = [blocks.map((item) => item.slice(0, 32))],
    hoarderN2 = [blocks.map((item) => item.slice(32, 64))];
  console.log(keysInc);

  for (let i = 1; i <= 32; i++) {
    console.log("шифровка");
    if (i <= 24) {
      hoarderN1[i] = IncriptionBlock(
        hoarderN1[i - 1],
        hoarderN2[i - 1],
        keys[(i - 1) % 8]
      );
      hoarderN2[i] = hoarderN1[i - 1];
    } else if (i <= 31) {
      hoarderN1[i] = IncriptionBlock(
        hoarderN1[i - 1],
        hoarderN2[i - 1],
        keys[32 - i]
      );
      hoarderN2[i] = hoarderN1[i - 1];
    } else {
      /*hoarderN1[i] = IncriptionBlock(
        hoarderN1[i - 1],
        hoarderN2[i - 1],
        keys[32 - i]
      );
      hoarderN2[i] = hoarderN1[i - 1];*/
      hoarderN1[i] = hoarderN1[i - 1];
      hoarderN2[i] = IncriptionBlock(
        hoarderN1[i - 1],
        hoarderN2[i - 1],
        keys[32 - i]
      );
    }
  }
  console.log(hoarderN1, hoarderN2);
  let T = [];
  for (let i = 0; i < blocks.length; i++) {
    T[i] = [].concat(hoarderN1[32][i], hoarderN2[32][i]);
  }

  /*
      TODO: процесс блочного расшифрования сообщения
   */
  // массив ключей для расшифрования
  let keyDec = [].concat(keys.reverse(), keys, keys, keys.reverse());
  console.log(keyDec);

  let hoarderN1Dec = [T.map((item) => item.slice(0, 32))],
    hoarderN2Dec = [T.map((item) => item.slice(32, 64))];

  for (let i = 31; i >= 0; i--) {
    console.log("расшифровка");
    if (32 - i <= 8) {
      hoarderN1Dec[32 - i] = IncriptionBlock(
        hoarderN1Dec[32 - i - 1],
        hoarderN2Dec[32 - i - 1],
        keyDec[32 - i - 1]
      );
      hoarderN2Dec[32 - i] = hoarderN1Dec[32 - i - 1];
    } else if (32 - i <= 31) {
      hoarderN1Dec[32 - i] = IncriptionBlock(
        hoarderN1Dec[32 - i - 1],
        hoarderN2Dec[32 - i - 1],
        keyDec[(32 - i - 1) % 8]
      );
      hoarderN2Dec[32 - i] = hoarderN1Dec[32 - i - 1];
    } else {
      /*hoarderN1Dec[32 - i] = IncriptionBlock(
        hoarderN1Dec[32 - i - 1],
        hoarderN2Dec[32 - i - 1],
        keyDec[32 - i - 1]
      );
      hoarderN2Dec[32 - i] = hoarderN1Dec[32 - i - 1];*/
      hoarderN1Dec[32 - i] = hoarderN1Dec[32 - i - 1];
      hoarderN2Dec[32 - i] = IncriptionBlock(
        hoarderN1Dec[32 - i - 1],
        hoarderN2Dec[32 - i - 1],
        keyDec[32 - i - 1]
      );
    }
  }
  console.log(hoarderN1Dec, hoarderN2Dec);

  // массив расшифрованных битов
  let T0 = [];
  for (let i = 0; i < blocks.length; i++) {
    T0[i] = [].concat(hoarderN1Dec[32][i], hoarderN2Dec[32][i]);
  }

  console.log("Исходное в битах:", messageToBin);
  return T0;
}

export default GOSTEasySwap;
