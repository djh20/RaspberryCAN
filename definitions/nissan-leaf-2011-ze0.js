module.exports = {
  id: 'nissan-leaf-2011-ze0',
  name: 'Nissan Leaf 2011 (ZE0)',
  messages: [
    {
      id: 0x5bc,
      name: 'Lithium Battery Controller (500ms)',
      signals: [
        {
          id: 0,
          name: 'soc_gids',
          process: (buf) => (buf[0] << 2) | (buf[1] >> 6)
        }
      ]
    },
    {
      id: 0x55a,
      name: 'Inverter (100ms)',
      signals: [
        {
          id: 0,
          name: 'motor_temp',
          process: (buf) => 5.0 / 9.0 * (buf[1] - 32)
        },
        {
          id: 0,
          name: 'inverter_temp',
          process: (buf) => 5.0 / 9.0 * (buf[2] - 32)
        }
      ]
    }
  ]
}