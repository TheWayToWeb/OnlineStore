import path from "path";
import { validate } from "uuid";
import { ReasonPhrases } from "http-status-codes";
import geoip from "geoip-lite";

import { readFileToPromise } from "../../functions/toPromise";
import { findItem } from "../../functions/findItemById";
import { getPublicIp } from "../../functions/getPublicIp";
import { getParsedEnv } from "../../config/envConfig";

const __dirname = path.resolve();
const itemFilePath = path.join(__dirname, "/service/items.json");
const { ADMIN_LOCATION, CUSTOMER_LOCATION } = getParsedEnv();

export const renderAttach = async (req, res) => {
  const { id } = req.params;
  const isId = validate(id);

  const publicIp = await getPublicIp();
  const location = geoip.lookup(publicIp);
  const { city } = location;

  if (city == ADMIN_LOCATION || city == CUSTOMER_LOCATION) {
    if (isId) {
      readFileToPromise(itemFilePath).then((itemData) => {
        findItem(res, id, itemData, "attach", "Прикрепить изображение.");
      });
    } else {
      res.send(ReasonPhrases.NOT_FOUND);
    }
  } else {
    res.send(ReasonPhrases.FORBIDDEN);
  }
};
