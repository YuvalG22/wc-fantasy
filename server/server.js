import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

const SPORT5_COOKIE = `_cc_id=c46259bfc0b645555578159533c4a420; _ga=GA1.1.1999076977.1753334271; _ga_F4B6MNVH4V=GS2.1.s1753334270$o10$g1$t1753334304$j26$l0$h0; cto_bidid=XUfbNl9IcU9rZzgyejJITnhtaHI2QUFJeXFPZ3FaQThubm8zbzQlMkJaZFJ0VWMza01rYiUyRnRyWWRwVVZuRFZ0TTZqbmt6bTIlMkZsVkltUml5UmFNTHk4S0hWZnNtWWxhS1dCR3c4SjJtWjVEcmw5bUVWcyUzRA; AMCV_248F210755B762187F000101%40AdobeOrg=1176715910%7CMCIDTS%7C20371%7CMCMID%7C14763399833870470520681434756663203197%7CMCAAMLH-1760591449%7C6%7CMCAAMB-1760591449%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1759993849s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C5.4.0; __gads=ID=fc3db468fc47c6b6:T=1753334271:RT=1765452987:S=ALNI_MbAjNC-RBO7L3cenhoUsoHtueDuZA; __gpi=UID=00001226a38b4ef0:T=1753334271:RT=1765452987:S=ALNI_Mbg4j8SK2cCn7gRAbZIYOQEMUPddg; FCCDCF=%5Bnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B%5B32%2C%22%5B%5C%22a63fcc1d-f52a-4219-9b8e-b67988fb5cd3%5C%22%2C%5B1761596481%2C932000000%5D%5D%22%5D%5D%5D; _pubcid=ed56969d-6f0a-4543-b533-26bddcf5d2c1; cto_bundle=Bt4_3l9wWldMa3BUY3NiSExlSXBwcFhQJTJCbnRjVFhtYnVybHh6U2FhRm5EJTJGRlhRJTJCeVo3SmdPRndRd1NZMjBXMGlDWDdCMmxhSmlNTUtVZFJyJTJCd2t4SnV6d0M2bG56JTJGNUR2ZGRzOHlDM2huWTdKM2trRHhUViUyQjJTMnVYJTJGRG1URE1sTHZSY1lZJTJCWVhvcmVTeWRZNkZqJTJGTFcxcnclM0QlM0Q; dmp-FE-cookie-dmpid=ada59110-0a30-4b8c-9a54-876089ff263a; _clck=lsl7oo%5E2%5Eg77%5E0%5E2295; _ga_WQC32T9BHT=GS2.1.s1782361359$o5$g1$t1782361535$j60$l0$h0; __za_cd_19760733=%7B%22visits%22%3A%22%5B1782361330%2C1782275254%2C1782021606%2C1781413656%2C1777538803%2C1776577298%2C1776140804%5D%22%2C%22campaigns_status%22%3A%7B%2295945%22%3A1782364050%2C%2296250%22%3A1781413698%7D%7D; minUnifiedSessionToken10=%7B%22sessionId%22%3A%22f1b4ca9a16-5c7868744c-76e0ffb11f-26b1eb841d-fa5a95cf96%22%2C%22uid%22%3A%221486df0325-c61ffcf689-717a5106c9-49d87c0d37-4bd973b3fe%22%2C%22__sidts__%22%3A1782384073851%2C%22__uidts__%22%3A1782384073851%7D; FCNEC=%5B%5B%22AKsRol_xhaGlKnNWQMKYLj6FzdJiejQFC_V8TntpcgQ_Wy0HwKB06t84tTSzBWnOXE5LZbfuurg7tHCsZ_3Kux0yu-dn2SEWegm9AVYdyuAxdhtBZ7PcFU3Q5vFELQIJgSwtmaBBYJBJ09Gj-dd69N5zOAqnUqlwJQ%3D%3D%22%5D%5D; dmp-FE-cookie-ts=1782478108494; panoramaId_expiry=1783232489181; panoramaId=b22828e8eaaade56d002291c812c4945a70223206c5d4236449354b4def9b677; panoramaIdType=panoIndiv; .AspNetCore.Cookies=CfDJ8JpmrYHpR1VGmuTLpKu48tREccQqFBRX2heM6nW9nKwVSFVm8rFs6xpKwCAnjCktahPcXcunn0EDXLQLl-7UH0Lur0O_3rMAf5C9GdOPczwMKcVUK4_8rLf_kDnloRM7B9clXaXcQUD4wergZkLfa2VbPtlP61QdXsUM3gRmH6mHahQE7vwQ_HcW7g7Hbewbe0M2SF-3_7Oj-g0D8Cv-TRfElw6LZ3Yw8_JM77WZ3crd35wzY7LTT92RcT1R16wueNwtzYO-o64O6TfwEVTeJituH86tHzMb4KzX5AuDi-MwKzat9kPerrqmVPNM5XIQ8HW-v2wv6UAE5hIfpd6mY_z-yogEyjcesdSs7rADcolFs4WaAP_qY8A3CKBz_VUg7mDTYWt6e9jMLQDQAZi1uB_siVMmG4VR2ztgXn8Yw2E7VwNVCguyfF2OA-PlkCwQp0NAtPQ-BIVygHjZLlqHwhSbJgnRjjgi-qr42wORjOxEKBU3ln2Cne3Pg5ebvmKprApiX15QyGHa7qjz8RSsXfU; _ga_4B37KQBXZ1=GS2.1.s1782889068$o38$g0$t1782889068$j60$l0$h0; _ga_2CB9C29485=GS2.1.s1782889068$o37$g0$t1782889068$j60$l0$h0`

app.get("/api/user-team/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const url = `https://dreamteam.sport5.co.il/api/UserTeam/GetUserAndTeam?seasonId=9&userId=${userId}`;

    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        cookie: SPORT5_COOKIE,
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/149.0.0.0 Safari/537.36",
      },
    });

    const text = await response.text();

    console.log("status:", response.status);
    console.log("content-type:", response.headers.get("content-type"));
    console.log("preview:", text.slice(0, 200));

    res.status(response.status);

    if (response.headers.get("content-type")?.includes("application/json")) {
      return res.json(JSON.parse(text));
    }

    return res.send(text);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log("Proxy server running on http://localhost:3001");
});