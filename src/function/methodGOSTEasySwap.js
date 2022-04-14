// функция сложения по модулю 2^32 двух 32-разрядных

// функция шифрования блока
function IncriptionBlock(N1, N2, key) {}

// функция генерации ключей
function GenerateKeys() {
  let K = [];
  for (let i = 0; i < 8; i++) {
    K[i] = Array.from({ length: 32 }, () => Math.floor(Math.random() * 31));
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
        .map((item) => block[i].unshift(item));
    }
  }
  return block;
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

// функция блочного шифрования по ГОСТ 28147-89 в режиме простой замены
function GOSTEasySwap(params) {
  /*
      TODO: процесс блочного шифрования сообщения
   */

  // перевод сообщения в массив целых чисел
  let messageToInt = ConvertToInt(params.messageM, params.mesLanguage);

  // разбиение на блоки
  let blocks = Blocking(messageToInt);

  // генерация ключей
  let keys = GenerateKeys(),
    keysInc = Array.concat(
      keys.reverse(),
      keys.reverse(),
      keys.reverse(),
      keys
    );
  let hoarderN1 = [blocks.slice(0, 32)],
    hoarderN2 = [blocks.slice(32, 64)];

  for (let it = 1; it <= 32; it++) {
    hoarderN1[i] = IncriptionBlock(hoarderN1, hoarderN2, keysInc[i]);
    hoarderN2[i] = hoarderN1[i];
  }
  return keys;
}

export default GOSTEasySwap;
