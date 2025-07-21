import os
import time
from pathlib import Path
from rest_framework.decorators import api_view
from rest_framework.response import Response

DATA_DIR = Path(__file__).resolve().parent.parent / 'data' / 'events'
RESULTS_PER_PAGE = 20

@api_view(['GET'])
def search_events(request):
    # Debug initialization
    print(f"\n=== NEW SEARCH REQUEST ===")
    print(f"Query: {request.GET.get('q', '')}")
    print(f"Time Range: {request.GET.get('start', '0')}-{request.GET.get('end', '2147483647')}")
    print(f"Page: {request.GET.get('page', '1')}")
    
    # Get parameters
    search_string = request.GET.get('q', '').strip()  # Removed .lower() for case sensitivity
    page = int(request.GET.get('page', 1))
    start_time = int(request.GET.get('start', 0))
    end_time = int(request.GET.get('end', 2147483647))
    
    results = []
    total_matches = 0
    files_processed = 0
    lines_processed = 0
    sample_lines_shown = 0

    for filename in sorted(os.listdir(DATA_DIR)):
        if filename.startswith('.'):
            continue
            
        files_processed += 1
        filepath = os.path.join(DATA_DIR, filename)
        
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as file:
                for line in file:
                    lines_processed += 1
                    parts = line.strip().split()
                    
                    # Show first 3 lines as samples
                    if sample_lines_shown < 3:
                        print(f"\nSample line {sample_lines_shown + 1}:")
                        print(f"Raw: {line.strip()}")
                        print(f"Parts: {parts[:15]}")  # Show first 15 elements
                        sample_lines_shown += 1
                    
                    # Skip malformed lines
                    if len(parts) < 14:
                        continue
                        
                    try:
                        event = {
                            'serialno': parts[0],
                            'version': parts[1],
                            'account_id': parts[2],
                            'instance_id': parts[3],
                            'srcaddr': parts[4],
                            'dstaddr': parts[5],
                            'srcport': parts[6],
                            'dstport': parts[7],
                            'protocol': parts[8],
                            'packets': parts[9],
                            'bytes': parts[10],
                            'starttime': int(parts[11]),
                            'endtime': int(parts[12]),
                            'action': parts[13],  # Removed .lower()
                            'log_status': parts[14] if len(parts) > 14 else 'UNKNOWN',  # Removed .lower()
                            'file': filename,
                            'raw': line  # Removed .lower()
                        }
                    except (ValueError, IndexError) as e:
                        print(f"Parse error in line {lines_processed}: {str(e)}")
                        continue
                    
                    # Time filter (overlap check)
                    time_match = (start_time <= event['endtime']) and (end_time >= event['starttime'])
                    if not time_match:
                        continue
                        
                    # Search conditions
                    match = not search_string  # Match all if no search query
                    
                    if search_string:
                        conditions = [cond.strip() for cond in search_string.split() if cond.strip()]
                        print(f"\nSearch conditions: {conditions}")
                        
                        for cond in conditions:
                            if '=' in cond:  # Field-based search
                                field, value = cond.split('=', 1)
                                field = field.lower()  # Field names are still case-insensitive
                                
                                print(f"Checking field condition: {field}={value}")
                                print(f"Against event: {event.get(field, 'N/A')}")
                                
                                if field in ['action', 'act']:
                                    match = (event['action'] == value)
                                    print(f"Action match: {event['action']} == {value} -> {match}")
                                elif field in ['status', 'log_status']:
                                    match = (event['log_status'] == value)
                                    print(f"Status match: {event['log_status']} == {value} -> {match}")
                                elif field in ['src', 'srcaddr', 'source']:
                                    match = (value in event['srcaddr'])
                                    print(f"Source IP match: {value} in {event['srcaddr']} -> {match}")
                                elif field in ['dst', 'dstaddr', 'destination']:
                                    match = (value in event['dstaddr'])
                                    print(f"Destination IP match: {value} in {event['dstaddr']} -> {match}")
                                elif field in ['proto', 'protocol']:
                                    match = (value == event['protocol'])
                                    print(f"Protocol match: {value} == {event['protocol']} -> {match}")
                                else:
                                    match = False
                            else:  # Generic search
                                match = (cond in line)
                                print(f"Generic search: {cond} in line -> {match}")
                            
                            if not match:
                                print("Condition failed, breaking")
                                break
                    
                    if match:
                        total_matches += 1
                        if (page - 1) * RESULTS_PER_PAGE <= total_matches - 1 < page * RESULTS_PER_PAGE:
                            results.append(event)
                            print(f"MATCH #{total_matches}: {event['action']} {event['log_status']} | {event['srcaddr']} -> {event['dstaddr']}")
                        
                        # Early termination
                        if total_matches >= page * RESULTS_PER_PAGE + 1000:
                            break
        except Exception as e:
            print(f"Error processing {filename}: {str(e)}")
            continue
    
    # Final debug summary
    print("\n=== SEARCH SUMMARY ===")
    print(f"Files processed: {files_processed}/{len(os.listdir(DATA_DIR))}")
    print(f"Lines scanned: {lines_processed}")
    print(f"Total matches found: {total_matches}")
    print(f"Results returned: {len(results)}")
    
    return Response({
        'results': results,
        'page': page,
        'total_pages': (total_matches // RESULTS_PER_PAGE) + 1,
        'total_results': total_matches,
        'debug': {
            'files_processed': files_processed,
            'lines_scanned': lines_processed,
            'sample_lines_shown': sample_lines_shown
        }
    })