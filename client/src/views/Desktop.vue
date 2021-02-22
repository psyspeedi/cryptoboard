<template>
  <v-container fluid class="Desktop">
    <v-row>
      <v-col>
        <v-container fluid class="exchange">
          <v-select
            :items="exchangeInfo"
            :item-text="'name'"
            :item-value="'symbol'"
            label="Exchange"
            @change="setExchange"
          ></v-select>
        </v-container>
      </v-col>
      <v-col>
        <v-container fluid class="pair">
          <v-text-field
            v-model="pair"
            class="input"
            @keypress.enter="add"
            label="Pair"
          ></v-text-field>
          <v-btn @click="add">Add</v-btn>
        </v-container>
      </v-col>
    </v-row>

    <v-container fluid>
      <v-row>
        <v-card
          v-for="ticker in tickers"
          :key="ticker.price"
          class="ma-5"
          min-width="200"
        >
          <v-card-text>
            <div>{{ ticker.pair.toUpperCase() }}</div>
            <p class="display-1 text--primary">
              {{ ticker.price }}
            </p>
            <p>{{ticker.exchange.toUpperCase()}}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn class="ma-2 blue-grey lighten-4">
              <v-icon dark left> mdi-minus-circle </v-icon>Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: "Desktop",
  data: () => ({
    tickers: [],
    pair: "",
    currentExchange: null,
    marketsInfo: [],
    exchangeInfo: [],
    connection: null,
    subscriptions: [],
  }),
  methods: {
    setExchange(exchange) {
      console.log(exchange);
      this.currentExchange = exchange;
    },
    wsSend(data) {
      if (!this.connection.readyState) {
        setTimeout(() => this.wsSend(data), 100);
      } else {
        this.connection.send(data);
      }
    },

    wsInit() {
      this.connection = new WebSocket("ws://localhost:8999");

      // this.connection.onopen = () => {
      //   console.log("Соединение установлено");
      // };

      // this.connection.onclose = (event) => {
      //   if (event.wasClean) {
      //     console.log("Соединение закрыто чисто");
      //   } else {
      //     console.log("Обрыв соединения");
      //   }

      //   console.log("Код " + event.code + " причина: " + event.reason);
      // };

      // this.connection.onerror = (error) => {
      //   console.log("Ошибка " + error.message);
      // };

      this.connection.onmessage = (m) => {
        // console.log(JSON.parse(m.data));
        const msg = JSON.parse(m.data);

        // console.log(msg);

        if (this.tickers.some((t) => t.id === msg.market.id)) {
          this.tickers = this.tickers.map((t) => {
            if (t.id === msg.market.id) {
              return {
                id: msg.market.id,
                exchange: this.getNameExchange(msg.market.exchangeID),
                pair: this.getPair(msg.market.currencyPairID),
                price: msg.trades[0].price,
                side: msg.trades[0].side,
              }
            }

            return t;
          });
        } else {
          this.tickers.push({
            id: msg.market.id,
            exchange: this.getNameExchange(msg.market.exchangeID),
            pair: this.getPair(msg.market.currencyPairID),
            price: msg.trades[0].price,
            side: msg.trades[0].side,
          });
        }
      };

      console.log(this.tickers);

      this.wsSend(
        JSON.stringify({ event: "init", subscriptions: ["markets:61542:trades"] })
      );
    },

    add() {
      console.log(this.pair, this.currentExchange, this.marketsInfo);

      //TODO: проверить как тут ищется
      const result = this.marketsInfo
        .filter((m) => m.exchange === this.currentExchange)
        .filter((m) => m.pair === this.pair.trim().toLowerCase())[0];

      console.log(result);  

      if (result) {
        this.subscriptions.push(`markets:${result.id}:trades`);

      
        this.wsSend(
          JSON.stringify({
            event: "update",
            subscriptions: this.subscriptions,
          })
        );
      }
    },

    getNameExchange(idExchange) {
      return this.exchangeInfo.filter(ex => ex.id === idExchange)[0].name
    },

    getPair(pairId) {
      console.log(pairId);
      console.log(this.marketsInfo);
      return this.marketsInfo.filter(m => m.id === pairId)[0].pair
    },

    async fetchExchangeInfo() {
      const response = await fetch("http://localhost:3000/api/exchange");
      const res = await response.json();
      this.exchangeInfo = res.result;
      console.log(this.marketsInfo);
    },

    async fetchMarketsInfo() {
      const response = await fetch("http://localhost:3000/api/markets");
      const res = await response.json();
      this.marketsInfo = res.result;
      console.log(this.marketsInfo);
    },
  },
  async created() {
    await this.fetchExchangeInfo();
    await this.fetchMarketsInfo();
    this.wsInit();

    console.log(this.exchangeInfo);console.log(this.marketsInfo);
  },
};
</script>

<style lang="scss">
.Desktop {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;

  .pair {
    display: flex;
    align-items: baseline;
    justify-content: center;
    max-width: 350px;

    .input {
      margin-right: 20px !important;
    }
  }
}
</style>
