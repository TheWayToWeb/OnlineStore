import path from "path";
import { validate } from "uuid";
import { ReasonPhrases } from "http-status-codes";

import { readFileToPromise } from "../../functions/toPromise";
import { findItem } from "../../functions/findItemById";
import { getPublicIp } from "../../functions/getPublicIp";
import { getParsedEnv } from "../../config/envConfig";

const __dirname = path.resolve();
const itemFilePath = path.join(__dirname, "/service/items.json");
const { ADMIN_IP, CUSTOMER_IP } = getParsedEnv();

export const renderAttach = async (req, res) => {
  const { id } = req.params;
  const isId = validate(id);

  if (isId) {

    const publicIp = await getPublicIp();

    if ((publicIp == ADMIN_IP) || (publicIp == CUSTOMER_IP)) {
      readFileToPromise(itemFilePath).then((itemData) => {
        findItem(res, id, itemData, "attach", "Прикрепить изображение.");
      });
    } else {
      res.send(ReasonPhrases.FORBIDDEN);
    }
  } else {
    res.send(ReasonPhrases.NOT_FOUND);
  }
}
