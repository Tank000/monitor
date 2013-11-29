/************************************************/
/*  功能：转换数据格式（K，M，G...）            */
/*  step：步长，1000或1024                      */
/*  u：数据的初始单位，用数字表示，如1为从K开始 */
/*  data：需要转换的数据                        */
/************************************************/
exports.dataConvert = function(step, u, data) {
  var unit = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y', 'N'];
  var data_c = data;
  while (data_c >= step) {
    data_c = data_c/step;
    u++;
  }
  data_c = data_c.toFixed(2) + unit[u];
  return data_c;
}