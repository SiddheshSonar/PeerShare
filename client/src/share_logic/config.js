
const turnConfig = {
  iceServers: [
    { urls: [
      "stun:bn-turn1.xirsys.com"
    ] },
    {
      username: 
      "67JVSBLop5DqymSoHACKdBZmSQz_19LJX8Hk-bkVSGNu_FhzuoxZ52EFYmEX43-0AAAAAGXLXc9zdGVwaGVuMDM=", 
      credential: 
      "d588ed62-ca69-11ee-a4f6-0242ac140004",
      urls: [
        "turn:bn-turn1.xirsys.com:80?transport=udp",
        "turn:bn-turn1.xirsys.com:3478?transport=udp",
        "turn:bn-turn1.xirsys.com:80?transport=tcp",
        "turn:bn-turn1.xirsys.com:3478?transport=tcp",
        "turns:bn-turn1.xirsys.com:443?transport=tcp",
        "turns:bn-turn1.xirsys.com:5349?transport=tcp"
      ],
    },
  ],

};

export default turnConfig;
