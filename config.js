exports.conf = {
    secret: '076ee61d63aa10#tank.tyt@gmail.com#a125ea872411e433b9',
    maxAge: 3600*1000*24*7,
    url:'db://61.173.82.35:27017?auto_reconnect=true',
    option:{
        database:'tag_monitor',
        username:'tank',
        password:'forlove',
        safe: true,
        socketOptions: {timeout: 2000}
    }
}


exports.INFO =  {
   machine_type:['unknown','other','x86','x86_64','ia64','sparc','alpha','powerpc','m68k','mips','arm','hppa','s390'],
   os_name:['unknown','other','linux','windows','darwin','hpux','aix','dragonfly','freebsd','netbsd','openbsd','osf','solaris']
}

exports.MetricMap = function(){
  return {
  'agent': {'name': 'IP', 'unit': '','group':'host'},
  'hostname': {'name': '主机名', 'unit': '','group':'host'},
  'os_name': {'name': 'IP', 'unit': '','group':'host'},
  'machine_type': {'name': '主机类型', 'unit': '','group':'host'},
  'unixSecondsUTC': {'name': '更新时间', 'unit': '','group':'host'},
  'UUID': {'name': 'UUID', 'unit': '','group':'host'},
  'os_release': {'name': '操作系统', 'unit': '','group':'host'},
  
  'disk_total': { 'name': '磁盘总量', 'unit': '字节' ,'group':'disk'},
  'disk_free': { 'name': '空闲磁盘', 'unit': '字节' ,'group':'disk'},
  'disk_partition_max_used': { 'name': '最大磁盘占用率', 'unit': '%' ,'group':'disk'},
  'disk_reads': { 'name': '磁盘读取请求', 'unit': '次/秒' ,'group':'disk'},
  'disk_bytes_read': { 'name': '磁盘读取字节', 'unit': '字节/秒' ,'group':'disk'},
  'disk_read_time': { 'name': '磁盘读取时间', 'unit': '' ,'group':'disk'},
  'disk_writes': { 'name': '磁盘写入请求', 'unit': '次/秒' ,'group':'disk'},
  'disk_bytes_written': { 'name': '磁盘写入字节', 'unit': '字节/秒' ,'group':'disk'},
  'disk_write_time': { 'name': '磁盘写入时间', 'unit': '' ,'group':'disk'},

  'mem_total': { 'name': '内存总量', 'unit': '字节','group':'memory' },
  'mem_free': { 'name': '空闲内存', 'unit': '字节','group':'memory' },
  'mem_shared': { 'name': '共享内存', 'unit': '字节','group':'memory' },
  'mem_buffers': { 'name': '缓冲区内存', 'unit': '字节','group':'memory' },
  'mem_cached': { 'name': '缓存内存', 'unit': '字节','group':'memory' },
  'swap_total': { 'name': '交换分区总量', 'unit': '字节','group':'memory' },
  'swap_free': { 'name': '空闲交换分区', 'unit': '字节','group':'memory' },
  'page_in': { 'name': '内存换入页数', 'unit': '次/秒','group':'memory' },
  'page_out': { 'name': '内存换出页数', 'unit': '次/秒','group':'memory' },
  'swap_in': { 'name': '交换分区换入页数', 'unit': '次/秒','group':'memory' },
  'swap_out': { 'name': '交换分区换出页数', 'unit': '次/秒','group':'memory' },

  'cpu_load_one': { 'name': '1分钟平均负载', 'unit': '%' ,'group':'cpu'},
  'cpu_load_five': { 'name': '5分钟平均负载', 'unit': '%' ,'group':'cpu'},
  'cpu_load_fifteen': { 'name': '15分钟平均负载', 'unit': '%' ,'group':'cpu'},
  'cpu_proc_run': { 'name': '运行进程数', 'unit': '' ,'group':'cpu'},
  'cpu_proc_total': { 'name': '所有进程数', 'unit': '' ,'group':'cpu'},
  'cpu_num': { 'name': 'CPU线程数', 'unit': '' ,'group':'cpu'},
  'cpu_speed': { 'name': 'CPU频率', 'unit': 'MHz' ,'group':'cpu'},
  'cpu_uptime': { 'name': 'CPU运行时间', 'unit': 's' ,'group':'cpu'},
  'cpu_user': { 'name': 'USER占用率', 'unit': '%' ,'group':'cpu'},
  'cpu_nice': { 'name': 'NICE占用率', 'unit': '%' ,'group':'cpu'},
  'cpu_system': { 'name': 'SYSTEM占用率', 'unit': '%' ,'group':'cpu'},
  'cpu_idle': { 'name': '空闲率', 'unit': '%' ,'group':'cpu'},
  'cpu_wio': { 'name': '等待IO占用率', 'unit': '%' ,'group':'cpu'},
  'cpuintr': { 'name': '中断占用率', 'unit': '%' ,'group':'cpu'},
  'cpu_sintr': { 'name': '软中断占用率', 'unit': '%' ,'group':'cpu'},
  'cpuinterrupts': { 'name': '中断数', 'unit': '次/秒' ,'group':'cpu'},
  'cpu_contexts': { 'name': '上下文交换数', 'unit': '次/秒' ,'group':'cpu'},

  'nio_bytes_in': { 'name': '流入字节', 'unit': '字节/秒' ,'group':'network'},
  'nio_pkts_in': { 'name': '流入报文', 'unit': '报文/秒' ,'group':'network'},
  'nio_errs_in': { 'name': '流入错误', 'unit': '错误/秒' ,'group':'network'},
  'nio_drops_in': { 'name': '流入丢包', 'unit': '丢包/秒' ,'group':'network'},
  'nio_bytes_out': { 'name': '流出字节', 'unit': '字节/秒' ,'group':'network'},
  'nio_pkts_out': { 'name': '流出报文', 'unit': '报文/秒' ,'group':'network'},
  'nio_errs_out': { 'name': '流出错误', 'unit': '错误/秒' ,'group':'network'},
  'nio_drops_out': { 'name': '流出丢包', 'unit': '丢包/秒' ,'group':'network'},
  }
}
