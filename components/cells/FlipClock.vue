<template>
  <div class="clock-container">

    <flip-item :total="100" v-for="t in timeArr" :current="t" />
  </div>
</template>

<script>
import FlipItem from "./FlipItem.vue";

export default {
  components: {
    FlipItem,
  },
  data() {
    return {
      timeArr: this.getTimeArr(),
    };
  },
  mounted() {
    this.startTimer();
  },
  beforeDestroy() {
    this.stopTimer();
  },
  methods: {
    getTimeArr(now = new Date()) {
      const h = now.getHours();
      const m = now.getMinutes();
      const s = now.getSeconds();
      return [...this.toArr(h), ...this.toArr(m), ...this.toArr(s)];
    },
    toArr(n) {
      return n >= 10 ? ("" + n).split("").map((item) => Number(item)) : [0, n];
    },

    startTimer() {
      this.stopTimer();
      const text = "Flug verspätet?"
      const ascii = text.toUpperCase().split("").map(c => c.charCodeAt(0));

      this.timer = setTimeout(() => {
        console.log(this.getTimeArr())
        const text = "Wie gehts".toUpperCase().split("").map(c => c.charCodeAt(0));
        console.log([...this.getTimeArr().slice(0, 5), this.getTimeArr()[5]])
        this.timeArr = ascii;
        // this.timeArr = [...this.getTimeArr().slice(0, 5), this.getTimeArr()[5]];
        this.startTimer();
      }, 2000);
    },
    stopTimer() {
      clearTimeout(this.timer);
    },
  },
};
</script>

<style lang="scss" scoped>
.clock-container {
  display: flex;
  align-items: center;
}
</style>
