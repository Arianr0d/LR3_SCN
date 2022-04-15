// функция сложения по модулю 2^32 двух 32-разрядных

// функция шифрования блока
function IncriptionBlock(N1, N2, key) {
  let sumMod2_32 = [],
    K = 0;
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
    sumMod2_32[i] = ConvertToBinary([Math.abs((a + K) % 2 ** 32 ^ b)], 32);
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

function convertBlocking(blocks) {
  let simb = ''
  let mes = []
  for (let block of blocks) {
    for (let item of block) {
      simb += item
      if (simb.length === 8) {
        let a = 0
        simb.split('').forEach((item, index) => a += Number(item) * 2 ** (8 - index - 1))
        mes.push(a)
        simb = ''
      }
    }
  }
  return mes
}

// функция перевода сообщения в массив целых чисел
function ConvertToInt(mes, lang) {
  if (lang == "en") {
    return Array.from(mes).map((letter) => letter.toLowerCase().charCodeAt(0)-96);
  } else if (lang == "ru") {
    return Array.from(mes).map((letter) => letter.toLowerCase().charCodeAt(0)-1071);
  }
}

// функция перевода массива в строку
function ConvertToString(mesInt, lang) {
  let result = "";
  if (lang == "en") {
    mesInt.map((letter) => (result += String.fromCharCode(letter+96)));
    return result;
  } else if (lang == "ru") {
    mesInt.map((letter) => (result += String.fromCharCode(letter+1071)));
    return result;
  }
}

function ConvertToBinary(massInt, countBit) {
  let binaryArr = "";
  for (let item of massInt) {
    let binary = (item % 2).toString();
    for (; item > 1;) {
      item = parseInt(item / 2);
      binary = (item % 2) + binary;
    }
    binaryArr += "0".repeat(countBit - binary.length) + binary;
  }
  return binaryArr.split("").map((item) => parseInt(item));
}

// функция блочного шифрования по ГОСТ 28147-89 в режиме простой замены
function GOSTEasySwap(params) {
  /*
      TODO: процесс блочного шифрования сообщения
   */

  // перевод сообщения в массив целых чисел
  let messageToInt = ConvertToInt(params.messageM, params.mesLanguage);
  let messageToBin = ConvertToBinary(messageToInt, 8);

  //console.log(messageToInt);
  //console.log(messageToBin);

  // разбиение на блоки
  let blocks = Blocking(messageToBin);
  //console.log(blocks);

  // генерация ключей
  let keys = GenerateKeys(),
    keysInc = [].concat(keys.reverse(), keys.reverse(), keys.reverse(), keys);
  let hoarderN1 = [blocks.map((item) => item.slice(0, 32))],
    hoarderN2 = [blocks.map((item) => item.slice(32, 64))];
  console.log(messageToInt, messageToBin);

  for (let i = 1; i <= 32; i++) {
    if (i <= 24) {
      hoarderN1[i] = IncriptionBlock(
        hoarderN1[i - 1],
        hoarderN2[i - 1],
        keysInc[(i - 1) % 8]
      );
      hoarderN2[i] = hoarderN1[i - 1];
    } else if (i <= 31) {
      hoarderN1[i] = IncriptionBlock(
        hoarderN1[i - 1],
        hoarderN2[i - 1],
        keysInc[32 - i]
      );
      hoarderN2[i] = hoarderN1[i - 1];
    } else {
      hoarderN1[i] = hoarderN1[i - 1];
      hoarderN2[i] = IncriptionBlock(
        hoarderN1[i - 1],
        hoarderN2[i - 1],
        keysInc[32 - i]
      );
    }
  }
  console.log(hoarderN1, hoarderN2);
  let T = [];
  for (let i = 0; i < blocks.length; i++) {
    T[i] = [].concat(hoarderN1[32][i], hoarderN2[32][i]);
  }

  let answer = convertBlocking(T)
  answer = ConvertToString(answer, params.mesLanguage)
  /*
      TODO: процесс блочного расшифрования сообщения
   */
  // массив ключей для расшифрования
  let keyDec = [].concat(keys.reverse(), keys, keys.reverse(), keys.reverse());
  let hoarderN1Dec = new Array(33)
  let hoarderN2Dec = new Array(33)

  hoarderN1Dec[32] = [T.map((item) => item.slice(0, 32))],
  hoarderN2Dec[32] = [T.map((item) => item.slice(32, 64))];

  for (let i = 1; i <= 32; i++) {
    if (i <= 8) {
      hoarderN1Dec[32 - i] = IncriptionBlock(
        hoarderN1Dec[32 - i + 1],
        hoarderN2Dec[32 - i + 1],
        keyDec[i - 1]
      );
      hoarderN2Dec[32 - i] = hoarderN1Dec[32 - i + 1];
    } else if (i <= 31) {
      hoarderN1Dec[32 - i] = IncriptionBlock(
        hoarderN1Dec[32 - i + 1],
        hoarderN2Dec[32 - i + 1],
        keyDec[(32 - i) % 8]
      );
      hoarderN2Dec[32 - i] = hoarderN1Dec[32 - i + 1];
    } else {
      hoarderN1Dec[32 - i] = hoarderN1Dec[32 - i + 1];
      hoarderN2Dec[32 - i] = IncriptionBlock(
        hoarderN1Dec[32 - i + 1],
        hoarderN2Dec[32 - i + 1],
        keyDec[32 - i]
      );
    }
  }
 
  // массив расшифрованных битов 
  let T0 = [];
  for (let i = 0; i < blocks.length; i++) {
    T0[i] = [].concat(hoarderN1Dec[0][i], hoarderN2Dec[0][i]);
  }
  console.log(convertBlocking(T0))
  return ConvertToString(convertBlocking(T0), params.mesLanguage)
}

export default GOSTEasySwap;
