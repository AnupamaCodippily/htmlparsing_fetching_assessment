const axios = require("axios");
const { parse } = require("node-html-parser");

const getProductInfo = async (url) => {
  let res;
  try {
    res = await axios.get(url);

    const html = parse(res.data);

    const title = html.querySelector("#DynamicHeading_productTitle").innerHTML;

    const price = html
      .querySelector("#ProductPrice_productPrice_PriceContainer")
      .querySelector("span").innerHTML;
    const img = html
      .querySelector("#productImage div picture img")
      .getAttribute("src");
    // const inStock = html.querySelector('#ButtonPanel_buttons .pi-overflow-ctrl button').innerText !== 'Out of Stock'
    const bp_b = html.querySelector("#ButtonPanel_buttons");
    // const inStock =
    //   bp_b.querySelector("#buttons_OutOfStockButton") != undefined
    //     ? false
    //     : true;

    const aurl = JSON.parse(html.querySelector('.cli_findinstore_productinfo').attributes['data-productInfo'])['AvailabilityUrl']
    const pid = JSON.parse(html.querySelector('.cli_findinstore_productinfo').attributes['data-productInfo'])['ProductId']
    const skuid = JSON.parse(html.querySelector('.cli_findinstore_productinfo').attributes['data-productInfo'])['SkuId']
    const availability_id = JSON.parse(html.querySelector('.cli_findinstore_skuinfo').attributes['data-skuinfo'])[skuid]['AvailabilityId']

    const inv_data =await axios( {
      method: 'post',
      url :aurl,
      headers: {
        'Content-type': 'application/json',
      },
      data :JSON.stringify( [
        {
          "ProductId" : pid,
	        "SkuId" : skuid,
	        "AvailabilityId": availability_id
        }
      ])
    })

    const inStock = inv_data.data['inStock']

    /* TO BE IMPLEMENTED */
    return {
      url,
      title,
      img,
      inStock,
      price,
    };
  } catch (err) {
    console.log(err);
    return;
  }
};

const URL_1 =
  "https://www.microsoft.com/en-us/p/hyperkin-x88-wireless-legacy-headset-for-xbox-and-windows/8trwz09b0g07?cid=msft_web_collection&activetab=pivot%3aoverviewtab";
const URL_2 =
  "https://www.microsoft.com/en-us/p/turtle-beach-elite-atlas-aero-wireless-pc-gaming-headset/91nj35lwl7dj?cid=msft_web_collection";
const URL_3 =
  "https://www.microsoft.com/en-us/p/turtle-beach-atlas-edge-pc-audio-enhancer/92h3jlx35s65?cid=msft_web_collection";

async function main() {
  const data = await getProductInfo(URL_1);
  const data2 = await getProductInfo(URL_2);
  const data3 = await getProductInfo(URL_3);
  console.log(data);
  console.log(data2);
  console.log(data3);

  // Manual testing
  const URL_TEST_1 =
    "https://www.microsoft.com/en-us/p/xbox-wireless-controller/8t2d538wc7mn?cid=msft_web_collection&activetab=pivot%3aoverviewtab";
  const URL_TEST_2 =
    "https://www.microsoft.com/en-us/p/turtle-beach-stealth-700-gen-2-premium-wireless-gaming-headset-for-xbox-one-and-xbox-series-x-s/8wh200q1jg76?cid=msft_web_collection&activetab=pivot%3aoverviewtab";
  const URL_TEST_3 =
    "https://www.microsoft.com/en-us/p/devialet-phantom-reactor-legs/8qxx6mmhl194?cid=msft_web_collection&activetab=pivot%3aoverviewtab";

  const datat1 = await getProductInfo(URL_TEST_1);
  const datat2 = await getProductInfo(URL_TEST_2);
  const datat3 = await getProductInfo(URL_TEST_3);

  console.log(datat1);
  console.log(datat2);
  console.log(datat3);
}

main();

// let stockData = JSON.parse($('div.cli_findinstore_productinfo').attr('data-productinfo'));

module.exports.getprodinfo = getProductInfo;
