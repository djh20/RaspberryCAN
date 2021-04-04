module.exports = {
  id: 'nissan-leaf-2011-ze0',
  name: 'Nissan Leaf 2011 (ZE0)',
  messages: [
    {
      id: 0x11a,
      name: 'Shift Controller',
      values: [
        {
          id: 4,
          name: 'gear',
          process: (buf) => (buf[0] & 0xF0) >> 4,
        },
        {
          id: 0,
          name: 'powered',
          process: (buf) => (buf[1] & 0x40) >> 6,
        },
        {
          id: 5,
          name: 'eco',
          process: (buf) => (buf[1] & 0x10) >> 4,
        }
      ]
    },
    {
      id: 0x5bc,
      name: 'Lithium Battery Controller (500ms)',
      values: [
        {
          id: 7,
          name: 'soc_gids',
          process: (buf) => (buf[0] << 2) | (buf[1] >> 6)
        }
      ]
    },
    {
      id: 0x1db,
      name: 'Lithium Battery Controller (10ms)',
      values: [
        {
          id: 8,
          name: 'battery_current',
          log: false,
          process: (buf) => {
            let current = (buf[0] << 3) | (buf[1] & 0xe0) >> 5;
            // if the first bit is 1, the byte is negative so extend the sign bit
            // confused... i am confused... but it works
            if (current & 0x0400) current |= 0xf800;
            return -current / 2.0;
          },
          convert: (value) => new Uint16Array([value*100])
        }
      ]
    },
    {
      id: 0x55b,
      name: 'Lithium Battery Controller (10ms)',
      values: [
        {
          id: 6,
          name: 'soc_percent',
          process: (buf) => ((buf[0] << 2) | (buf[1] >> 6)) / 10.0,
          convert: (value) => new Uint16Array([value*100])
        }
      ]
    },
    {
      id: 0x1d4,
      name: 'Vehicle Control Module (10ms)',
      values: [
        {
          id: 9,
          name: 'charging',
          process: (buf) => {
            console.log(buf[6].toString(2));
            return (buf[6] & 0x40) >> 6
          }
        }
      ]
    },
    {
      id: 0x284,
      name: 'ABS Module',
      values: [
        {
          id: 2,
          name: 'left-speed',
          process: (buf) => ((buf[2] << 8) | buf[3]) / 10,
          convert: (value) => new Uint16Array([value])
        },
        {
          id: 3,
          name: 'right-speed',
          process: (buf) => ((buf[0] << 8) | buf[1]) / 10,
          convert: (value) => new Uint16Array([value])
        },
        {
          id: 1,
          name: 'rear-speed',
          process: (buf) => ((buf[4] << 8) | buf[5]) / 100
        },
      ]
    },
    {
      id: 0x55a,
      name: 'Inverter (100ms)',
      values: [
        {
          id: 12,
          name: 'motor_temp',
          process: (buf) => 5.0 / 9.0 * (buf[1] - 32),
          convert: (value) => new Uint16Array([value*100])
        },
        {
          id: 11,
          name: 'inverter_temp',
          process: (buf) => 5.0 / 9.0 * (buf[2] - 32),
          convert: (value) => new Uint16Array([value*100])
        }
      ]
    },
    {
      id: 0x54c,
      name: 'Climate',
      values: [
        {
          name: 'ambient_temp',
          process: (buf) => (buf[6]) / 2.0 - 40,
          convert: (value) => new Uint16Array([value*100])
        }
      ]
    },
    {
      id: 0x54b,
      name: 'Climate',
      values: [
        {
          id: 10,
          name: 'climate_fan_speed',
          process: (buf) => (buf[4] & 0xF0) / 8
        }
      ]
    }
  ]
}