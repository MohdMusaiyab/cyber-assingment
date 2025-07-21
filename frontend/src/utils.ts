// utils.ts
export const formatEpochTime = (epoch: number): string => {
    return new Date(epoch * 1000).toLocaleString();
  };
  
  export const formatBytes = (bytes: string): string => {
    const num = parseInt(bytes);
    if (isNaN(num)) return bytes;
    return new Intl.NumberFormat().format(num);
  };
  
  export const getProtocolName = (protocol: string): string => {
    const protoMap: Record<string, string> = {
      '6': 'TCP',
      '17': 'UDP',
      '1': 'ICMP'
    };
    return protoMap[protocol] || protocol;
  };